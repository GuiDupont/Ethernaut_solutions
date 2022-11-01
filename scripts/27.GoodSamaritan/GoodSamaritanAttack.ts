import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/18.MagicNumber/MagicNumber.sol/MagicNum.json";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { FactoryOptions } from "hardhat/types";

async function deployContractArg(name: string, arg: any[]) {
  const ContactFactory = await ethers.getContractFactory(name);
  const contract = await ContactFactory.deploy(...arg);
  await contract.deployed();
  console.log(name, arg[0]);
  return contract;
}

async function deployContract(name: string) {
  const ContactFactory = await ethers.getContractFactory(name);
  const contract = await ContactFactory.deploy();
  await contract.deployed();
  return contract;
}

async function main() {
  const target = await deployContract("GoodSamaritan");
  console.log(target.address);
  const attacker = await deployContractArg("GoodSamaritanAttacker", [
    target.address,
  ]);
  const tx = await attacker.attack();
  await tx.wait();
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

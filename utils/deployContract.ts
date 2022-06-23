import { ethers } from "hardhat";

export async function deployContract(name: string) {
  const ContactFactory = await ethers.getContractFactory(name);
  const contract = await ContactFactory.deploy();
  await contract.deployed();
  return contract;
}

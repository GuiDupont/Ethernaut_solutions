// eslint-disable-next-line node/no-unpublished-import
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { FactoryOptions } from "hardhat/types";

async function deployContract(
  name: string,
  signerOrOptions?: Signer | FactoryOptions | undefined
) {
  const ContactFactory = await ethers.getContractFactory(name, signerOrOptions);
  const contract = await ContactFactory.deploy();
  await contract.deployed();
  return contract;
}

export { deployContract };

import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/18.MagicNumber/MagicNumber.sol/MagicNum.json";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployContract } from "../../utils/deployContract";

async function main() {
  const solver = await deployContract("DetectionBot");
  console.log(solver.address);
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

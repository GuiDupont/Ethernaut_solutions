import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";

async function displayEthBalance(
  msg: string,
  sender: SignerWithAddress,
  target: string
) {
  const balance = await sender.provider!.getBalance(target);
  console.log(msg, ethers.utils.formatEther(balance));
}

export { displayEthBalance };

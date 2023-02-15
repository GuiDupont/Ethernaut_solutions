/* eslint-disable node/no-unpublished-import */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

export async function sendEther(
  sender: SignerWithAddress,
  recipient: string,
  amountInEther: string
) {
  const pendingTX = await sender.sendTransaction({
    to: recipient,
    value: ethers.utils.parseEther(amountInEther),
  });
  await pendingTX.wait();
}

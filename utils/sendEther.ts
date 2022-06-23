import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

async function sendEther(
  sender: SignerWithAddress,
  recipient: string,
  amountInEther: string
) {
  const pendingTX = await sender.sendTransaction({
    to: recipient,
    value: ethers.utils.parseEther(amountInEther),
  });
  pendingTX.wait();
}


export { sendEther };

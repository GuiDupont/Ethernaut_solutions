import { ethers } from "hardhat";
import logger from "node-color-log";

async function getEthBalance(target: string, display: boolean = false) {
  const provider = ethers.provider;
  const balance = await provider!.getBalance(target);
  const formatted = ethers.utils.formatEther(balance);
  if (display) logger.info(`${target} balance is ${formatted} MATIC`);
  return formatted;
}

export { getEthBalance };

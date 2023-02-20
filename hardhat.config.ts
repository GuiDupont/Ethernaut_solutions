import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";

import "@nomiclabs/hardhat-ethers";
import { ethers } from "ethers";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },

      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.0",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.8.18",
      },
      {
        version: "0.4.24",
      },
    ],
    settings: {
      viaIR: true,
      yul: true,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MUMBAI_URL || "",
      },
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [
              {
                privateKey: process.env.PRIVATE_KEY!,
                balance: ethers.utils.parseEther("1000").toString(),
              },
              {
                privateKey: process.env.PRIVATE_KEY2!,
                balance: ethers.utils.parseEther("1000").toString(),
              },
            ]
          : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY2!]
          : [],
    },
  },
};

export default config;

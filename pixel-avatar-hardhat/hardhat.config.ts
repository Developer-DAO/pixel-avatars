import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const RINKEYBY_RPC_URL = process.env.ALCHEMY_RINKEBY_RPC_URL;
const MAINNET_RPC_URL =
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  "https://eth-mainnet.alchemyapi.io/v2/your-api-key";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || "Your Etherscan API Key";
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY ?? "";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  // defaultNetwork: "localhost",
  networks: {
    hardhat: {
      // gas: 50000,
      // gasPrice: 10000000,
      // forking: {
      //   /** Mainnet */
      //   // url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      // },
    },

    // ropsten: {
    //   url: process.env.ROPSTEN_URL || "",
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },

    rinkeby: {
      url: RINKEYBY_RPC_URL,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
    },

    // mainnet: {
    //   url: MAINNET_RPC_URL,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
  },

  etherscan: {
    // Your API key for Etherscan. Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;

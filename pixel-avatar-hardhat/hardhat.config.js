require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});



const RINKEYBY_RPC_URL = process.env.ALCHEMY_RINKEBY_RPC_URL
const MAINNET_RPC_URL = process.env.ALCHEMY_MAINNET_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key"

const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your Etherscan API Key"


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",

networks: {

    rinkeby: {

      url: process.env.ALCHEMY_RINKEBY_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`]

    },

    mainnet: {

      url: MAINNET_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`]

    },


  },


  etherscan: {
    // Your API key for Etherscan. Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  }



};

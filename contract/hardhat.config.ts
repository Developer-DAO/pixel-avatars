import { HardhatUserConfig, task } from 'hardhat/config'
import { HttpNetworkUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import '@openzeppelin/hardhat-upgrades'
import 'solidity-coverage'
import * as dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = (() => {
    function networkConfiguration(
        url: string | undefined,
        account: string | undefined
    ): HttpNetworkUserConfig {
        return {
            url: url ?? '',
            accounts: account ? [`0x${account}`] : 'remote',
        }
    }

    return {
        solidity: {
            version: '0.8.9',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1000,
                },
            },
        },
        defaultNetwork: 'localhost',
        networks: {
            hardhat: {},

            mumbai: networkConfiguration(
                process.env.MUMBAI_RPC_URL,
                process.env.MUMBAI_PRIVATE_KEY
            ),

            mainnet: networkConfiguration(
                process.env.MAINNET_RPC_URL,
                process.env.MAINNET_PRIVATE_KEY
            ),
        },

        etherscan: {
            // Your API key for Etherscan. Obtain one at https://etherscan.io/
            apiKey: process.env.ETHERSCAN_API_KEY ?? '',
        },

        gasReporter: {
            enabled: process.env.REPORT_GAS !== undefined,
            currency: 'USD',
        },
    }
})()

export default config

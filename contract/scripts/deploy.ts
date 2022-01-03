import { ethers } from 'hardhat'

async function main() {
    const [deployer] = await ethers.getSigners()

    console.log('Deploying contracts with the account:', deployer.address)

    console.log('Account balance:', (await deployer.getBalance()).toString())

    const contract = await ethers.getContractFactory('PixelAvatars')
    const token = await contract.deploy()

    console.log('Token address:', token.address)

    const serverAddress = process.env.SERVER_ADDRESS

    if (serverAddress) {
        await token.setServerAddress(serverAddress)

        console.log('Successfully updated server address to:', serverAddress)
    } else {
        console.warn(
            'WARNING: No server address set in .env. Please set one manually or minting attempts will fail.'
        )
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

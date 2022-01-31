import { ethers, upgrades } from 'hardhat'

async function main() {
    // ensure we have a server address, so web-server can authenticate with contract
    const serverAddress = process.env.SERVER_ADDRESS
    if (!serverAddress) {
        console.error(
            'No server address set in .env. Please set one manually or minting attempts will fail.'
        )
        return
    }
    console.log('Server address is:', serverAddress)

    // deploy upgradeable contract
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const Contract = await ethers.getContractFactory('PixelAvatars')
    const token = await upgrades.deployProxy(Contract)
    await token.setServerAddress(serverAddress)

    console.log(`OpenZeppelin Proxy deployed to: ${token.address} for VUE_APP_PIXEL_AVATAR_TOKEN and UPGRADEABLE_PROXY_ADDRESS`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

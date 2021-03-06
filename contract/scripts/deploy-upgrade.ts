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

    const upgradeableProxyAddress = process.env.UPGRADEABLE_PROXY_ADDRESS
    if (!upgradeableProxyAddress) {
        console.error(
            'Missing address for OpenZeppelin upgradeable proxy in .env. Required, please set.'
        )
        return
    }

    // deploy upgradeable contract
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const Contract = await ethers.getContractFactory('PixelAvatars')
    const token = await upgrades.upgradeProxy(upgradeableProxyAddress, Contract)
    await token.setServerAddress(serverAddress)

    console.log(
        `OpenZeppelin Proxy upgraded. Proxy is still: ${token.address} for VUE_APP_PIXEL_AVATAR_TOKEN and UPGRADEABLE_PROXY_ADDRESS`
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

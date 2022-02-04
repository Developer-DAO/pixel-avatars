const { GENESIS_RPC, GENESIS_TOKEN } = require('../constants')
const { PIXELAVATARS_RPC, PIXELAVATARS_TOKEN } = require('../constants')
const ethers = require('ethers')

const genesis = require('../../../abis/GenesisContract.json')
const provider = ethers.getDefaultProvider(GENESIS_RPC)
const contract = new ethers.Contract(GENESIS_TOKEN, genesis.abi, provider)

const pixelAvatars = require('../../../abis/PixelAvatars.json')
const avatarProvider = ethers.getDefaultProvider(PIXELAVATARS_RPC)
const avatarContract = new ethers.Contract(PIXELAVATARS_TOKEN, pixelAvatars.abi, avatarProvider)

module.exports = {
    async getOwnedTokens(address) {
        // Number of tokens owned by the address
        const balance = (await contract.balanceOf(address)).toNumber()

        // For each token the address owns we need to fetch the actual NFT
        const tokenPromises = [...Array(balance).keys()].map((idx) =>
            contract.tokenOfOwnerByIndex(address, idx)
        )

        const ownedTokens = (await Promise.all(tokenPromises)).map((t) => t.toNumber())

        // Number of Pixel Avatars tokens owned by the address
        const avatarBalance = (await avatarContract.balanceOf(address)).toNumber()

        // For each Pixel Avatars token the address owns we need to fetch the actual NFT
        const avatarTokenPromises = [...Array(avatarBalance).keys()].map((idx) =>
            avatarContract.tokenOfOwnerByIndex(address, idx)
        )

        const avatarOwnedTokens = (await Promise.all(avatarTokenPromises)).map((t) => t.toNumber())

        return ownedTokens.map((tokenId) => {
            return {
                tokenId: tokenId,
                minted: ( avatarOwnedTokens.indexOf(tokenId) > -1 )
            }
        })
    },

    async getOwnerOfGenesisTokenId(tokenId) {
        return contract
            .ownerOf(tokenId)
            .then((result) => result.toString())
            .catch((error) => {
                if (
                    error.error.message.indexOf(
                        'owner query for nonexistent token'
                    )
                ) {
                    return null
                }

                throw error
            })
    },
}

const {GENESIS_RPC, GENESIS_TOKEN} = require("../constants");
const ethers = require('ethers')
const genesis = require('../../../abis/GenesisContract.json')
const provider = ethers.getDefaultProvider(GENESIS_RPC)

const contract = new ethers.Contract(GENESIS_TOKEN, genesis.abi, provider)

module.exports = {
    async getOwnedTokens(address) {
        // Number of tokens owned by the address
        const balance = (await contract.balanceOf(address)).toNumber()

        // For each token the address owns we need to fetch the actual NFT
        const tokenPromises = [...Array(balance).keys()].map((idx) =>
            contract.tokenOfOwnerByIndex(address, idx)
        )

        return (await Promise.all(tokenPromises)).map((t) => t.toNumber())
    },

    async getOwnerOfGenesisTokenId(tokenId) {
        return contract
            .ownerOf(tokenId)
            .then(result => result.toString())
            .catch(error => {
                if (error.error.message.indexOf('owner query for nonexistent token')) {
                    return null;
                }

                throw error
            })
    }
}
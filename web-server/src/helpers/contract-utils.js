const ethers = require('ethers')
const genesis = require('../../contracts/GenesisContract.json')
const provider = ethers.getDefaultProvider(process.env.NETWORK_URL)
const token = process.env.GENESIS_CONTRACT_TOKEN
const contract = new ethers.Contract(token, genesis.abi, provider)

module.exports = {
    getOwnerOfGenesisTokenId(tokenId) {
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
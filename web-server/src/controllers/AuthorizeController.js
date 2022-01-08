const genesis = require('../repositories/GenesisRepository')
const utils = require('../utils')
const { PRIVATE_KEY, AUTHORIZATION_LIFETIME_SECONDS } = require('../constants')

module.exports = {
    async store(req, res) {
        const address = req.params.address
        const tokenId = req.body.tokenId

        // Validate request parameters
        if (tokenId == null) {
            return res
                .status(422)
                .json({ error: 'Missing required parameter: tokenId' })
        }

        // Get actual owner of requested token id
        const ownerAddress = await genesis.getOwnerOfGenesisTokenId(tokenId)

        // Fail if address doesn't match owner
        if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
            return res.status(422).json({
                error: ownerAddress
                    ? `Only the owner of the genesis token [${ownerAddress}] can claim this token [${tokenId}].`
                    : `No owner was found for genesis token [${tokenId}].`,
            })
        }

        // Create authorization signature
        const deadline =
            Math.round(Date.now() / 1000) + AUTHORIZATION_LIFETIME_SECONDS
        const message = utils.hexConcat([
            'TokenId:',
            tokenId.toString(),
            'Address:',
            address,
            'Deadline:',
            deadline.toString(),
        ])
        const hash = utils.hash(message)
        const signature = utils.sign(hash, PRIVATE_KEY)

        res.json({
            data: { tokenId, deadline, signature },
        })
    },
}

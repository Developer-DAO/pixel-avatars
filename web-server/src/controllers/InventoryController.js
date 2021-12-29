const genesis = require("../repositories/GenesisRepository");

module.exports = {
    async show(req, res) {
        res.json({
            data: await genesis.getOwnedTokens(req.params.address)
        })
    }
}
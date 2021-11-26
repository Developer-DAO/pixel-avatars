require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const contractUtils = require('./helpers/contract-utils.js')
const signatureUtils = require('./helpers/signature-utils.js')
const app = express()
const port = process.env.HTTP_PORT
const privateKey = process.env.PRIVATE_KEY

app.use(bodyParser.json())

app.post('/authorize-claim', async (req, res) => {
    // Validate request parameters
    const [tokenId, address] = [req.body.tokenId, req.body.address]

    if (tokenId == null || address == null){
        return res.status(422).json({
            error: 'Missing one or more required parameters: tokenId, address'
        });
    }

    // Get actual owner of requested token id
    const ownerAddress = await contractUtils.getOwnerOfGenesisTokenId(tokenId)

    // Fail if address doesn't match owner
    if (address !== ownerAddress) {
        return res.status(422).json({
            error: ownerAddress
                ? `Only the owner of the genesis token [${ownerAddress}] can claim this token [${tokenId}].`
                : `No owner was found for genesis token [${tokenId}].`
        });
    }

    const message = JSON.stringify({
        action: 'authorize-claim',
        timestamp: Date.now(),
        address: address
    })

    const signature = signatureUtils.sign(signatureUtils.hash(message), privateKey)

    res.json({
        data: {
            message,
            signature,
        }
    })
})

app.listen(port, () => {
    console.log(`Pixel webserver ready at http://localhost:${port}`)
})
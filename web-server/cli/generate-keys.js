const publicKeyToAddress = require('ethereum-public-key-to-address')
const {ec} = require("elliptic");

const keypair = new ec('secp256k1').genKeyPair()

const privateKey = keypair.getPrivate('hex')
const publicKey = keypair.getPublic('hex')
const address = publicKeyToAddress(publicKey)

console.log({
    privateKey,
    publicKey,
    address,
})
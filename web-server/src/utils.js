const { ec } = require('elliptic')
const { utils } = require('ethers')
const keccak256 = require('keccak256')
const publicKeyToAddress = require('ethereum-public-key-to-address')

const UNCOMPRESSED_PUBKEY_HEADER = 27

function hexConcat(parts) {
    return utils.hexConcat(
        parts.map((part) => (utils.isHexString(part) ? part : toHex(part)))
    )
}

function hexPrefix(value) {
    return '0x' + value
}

function toHex(str) {
    let result = ''
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16)
    }
    return hexPrefix(result)
}

function hash(message) {
    return keccak256(message).toString('hex')
}

function sign(hash, hexPrivateKey) {
    const signature = new ec('secp256k1')
        .keyFromPrivate(hexPrivateKey, 'hex')
        .sign(hash, { canonical: true })

    return {
        v: hexPrefix(
            (UNCOMPRESSED_PUBKEY_HEADER + signature.recoveryParam).toString(16)
        ),
        r: hexPrefix(signature.r.toString(16).padStart(64, '0')),
        s: hexPrefix(signature.s.toString(16).padStart(64, '0')),
    }
}

function generateKeypair() {
    const keypair = new ec('secp256k1').genKeyPair()

    const privateKey = keypair.getPrivate('hex')
    const publicKey = keypair.getPublic('hex')
    const address = publicKeyToAddress(publicKey)

    return { privateKey, publicKey, address }
}

module.exports = { generateKeypair, hash, sign, hexConcat, hexPrefix, toHex }

const { ec } = require('elliptic')
const keccak256 = require("keccak256");

const UNCOMPRESSED_PUBKEY_HEADER = 27;

module.exports = {
    hash(message) {
        message = "\x19Ethereum Signed Message:\n" + message.length + message

        return keccak256(message).toString('hex')
    },

    sign(hash, hexPrivateKey) {
        const signature = new ec('secp256k1')
            .keyFromPrivate(hexPrivateKey, 'hex')
            .sign(hash, { canonical: true })

        return {
            v: (UNCOMPRESSED_PUBKEY_HEADER + signature.recoveryParam).toString(16),
            r: signature.r.toString(16).padStart(64, '0'),
            s: signature.s.toString(16).padStart(64, '0'),
        }
    }
}
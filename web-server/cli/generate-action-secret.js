const { generateKeypair } = require('../src/utils')
const sodium = require('tweetsodium')

const config = {
    repo: 'Developer-DAO/pixel-avatars',
    publicKeyId: '568250167242549743',
    publicKey: 'FUbH7LzIYoY9JTygD0YkyLkkrQULdMnFssoCo/YRgWc=',
    secretName: 'SERVER_PRIVATE_KEY',
}

const keypair = generateKeypair()

// Convert the message and key to Uint8Array's (Buffer implements that interface)
const messageBytes = Buffer.from(keypair.privateKey)
const keyBytes = Buffer.from(config.publicKey, 'base64')

// Encrypt using LibSodium.
const encryptedBytes = sodium.seal(messageBytes, keyBytes)

// Base64 the encrypted secret
const encrypted = Buffer.from(encryptedBytes).toString('base64')

console.log(`To update GitHub Action Secret please run following command: \n`)
console.log(`hub api -XPUT /repos/${config.repo}/actions/secret/${config.secretName} -f key_id="${config.publicKeyId}" -f encrypted_value="${encrypted}"\n`)
console.log(`(requires http://hub.github.com installed)\n`)
console.log(`Please set contract SERVER_ADDRESS=${keypair.address}`)

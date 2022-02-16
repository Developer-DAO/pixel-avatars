const { generateKeypair } = require('../src/utils')
const sodium = require('tweetsodium')

const environments = {
    Staging: {
        name: 'Staging',
        publicKeyId: '568250167242549743',
        publicKey: 'YpCq4GbO4oWsRvJ4br0rhaGCLrvv/SrNtTBt2QWPTX4=',
    },
    Production: {
        name: 'Production',
        publicKeyId: '568250167242549743',
        publicKey: 'bxKnGP3uYODWJXcLxeguz1TZ1wq3q+N3raTM+jCnB2I=',
    },
}

const config = {
    repo: 'Developer-DAO/pixel-avatars',
    secretName: 'SERVER_PRIVATE_KEY',
    environment: environments[process.argv[2] ?? 'Production']
}

const keypair = generateKeypair()

// Convert the message and key to Uint8Array's (Buffer implements that interface)
const messageBytes = Buffer.from(keypair.privateKey)
const keyBytes = Buffer.from(config.environment.publicKey, 'base64')

// Encrypt using LibSodium.
const encryptedBytes = sodium.seal(messageBytes, keyBytes)

// Base64 the encrypted secret
const encrypted = Buffer.from(encryptedBytes).toString('base64')

console.log(`To update GitHub Action Secret please run following command: \n`)
console.log(
    `hub api -XPUT /repos/${config.repo}/environments/${config.environment.name}/secrets/${config.secretName} -f key_id="${config.environment.publicKeyId}" -f encrypted_value="${encrypted}"\n`
)
console.log(`(requires http://hub.github.com installed)\n`)
console.log(`Please set contract SERVER_ADDRESS=${keypair.address}`)

const { ec } = require('elliptic')
const { utils } = require('ethers')
// var minUtils = require('minimalistic-crypto-utils');
const keccak256 = require("keccak256");

// const _address = '0x957a3e51767a62c3EEE0b3dA6ab524FfEF5Fc04f';
//
// // address
// // 0x000000000000000000000000957a3e51767a62c3eee0b3da6ab524ffef5fc04f
//
// // foo + address
// // 0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000957a3e51767a62c3eee0b3da6ab524ffef5fc04f0000000000000000000000000000000000000000000000000000000000000003666f6f0000000000000000000000000000000000000000000000000000000000
//
// // foo + address packed
// // 0x666f6f957a3e51767a62c3eee0b3da6ab524ffef5fc04f
//
// //0x19457468657265756d205369676e6564204d6573736167653a0a0a446561646c696e653a313633373933343335300a416464726573733a957a3e51767a62c3eee0b3da6ab524ffef5fc04f
// // 0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000957a3e51767a62c3eee0b3da6ab524ffef5fc04f000000000000000000000000000000000000000000000000000000000000001a19457468657265756d205369676e6564204d6573736167653a0a000000000000000000000000000000000000000000000000000000000000000000000000000a0a446561646c696e653a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a313633373933343335300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000090a416464726573733a0000000000000000000000000000000000000000000000
// // 0x000000000000019457468657265756d205369676e6564204d6573736167653aa000000000000000000000000000000000000000000000a446561646c696e653a000000000000000000000000000000000000000000003136333739333433353000000000000000000000000000000000000000000000000a416464726573733a957a3e51767a62c3eee0b3da6ab524ffef5fc04f
//
//
// // function toHex(str) {
// //     let result = '';
// //     for (let i = 0; i < str.length; i++) {
// //         result += str.charCodeAt(i).toString(16);
// //     }
// //     return result;
// // }
//
// const _deadline = 1637934350
//
// const message = utils.hexConcat([
//     '0x'+toHex(`Deadline:${_deadline}|Address:`),
//     _address
// ])
// // 0x446561646c696e653a313633373933343335307c416464726573733a957a3e51767a62c3eee0b3da6ab524ffef5fc04f
//
// const hash = keccak256(message).toString('hex');
// // 0x2a4f90e6a09ae07e7da7b383806b9bfc6fde3130a691d740675ad36bbd1f1c51
//
//
// console.log(
//     hash
//     // toHex('Deadline:'),
//     // utils.arrayify(_address)
// )
//
// // console.log(message.map(p => utils.isHexString(p) ? p : '0x' + toHex(p)));
// // return;
//
// console.log(
//     // utils.hexConcat(['0x' + toHex('Deadline:1637934350Address:'),_address]),
//
//     // utils.hexConcat(
//     //     // message.map(p => utils.isHexString(p) ? p : utils.hexZeroPad('0x' + toHex(p), 32))
//     //     message.map(p => utils.isHexString(p) ? p : '0x' + toHex(p))
//     // )
//
//     // toHex('foo')
//     // toHex('foo')
//     // require('ethers').utils.hexConcat(['0x666f6f',_address]) // 0x666f6f957a3e51767a62c3eee0b3da6ab524ffef5fc04f
// )
//
// // const hashStruct = keccak256(
// //     // '.',
// //     _address
// // ).toString('hex');
// //
// // // const hash = keccak256("\x19\x01" + hashStruct).toString('hex');
// //
// // console.log(hashStruct);
//
//
// // const message = (
// //     "." +
// //     _address
// // );
// //
// // const message = (
// //     "\x19Ethereum Signed Message:\n" +
// //     "\nDeadline:" + '1637934350' +
// //     "\nAddress:" + keccak256(_address).toString('hex')
// // );
//
// // const message = keccak256(_address).toString('hex')
//
// // console.log(keccak256(message).toString('hex'));
//
// // console.log(keccak256(message).toString('hex'));
//
// return

const UNCOMPRESSED_PUBKEY_HEADER = 27;

function hexConcat(parts) {
    return utils.hexConcat(
        parts.map(part => utils.isHexString(part) ? part : '0x' + toHex(part))
    )
}

function toHex(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

function hash(message) {
    return keccak256(message).toString('hex')
}

function sign(hash, hexPrivateKey) {
    const signature = new ec('secp256k1')
        .keyFromPrivate(hexPrivateKey, 'hex')
        .sign(hash, { canonical: true })

    return {
        v: (UNCOMPRESSED_PUBKEY_HEADER + signature.recoveryParam).toString(16),
        r: signature.r.toString(16).padStart(64, '0'),
        s: signature.s.toString(16).padStart(64, '0'),
    }
}

module.exports = { hash, sign, hexConcat, toHex }
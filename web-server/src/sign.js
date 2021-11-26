const utils = require('./helpers/signature-utils.js')

const privateKey = '1f28bb3d7767fca1fb44edf122821ae37bad1cba256a512b85fe49cef6988129'
const address = '0x5408Dfe1AdD2bA2DCa93dDcA469Ff724F9fE022e';
const deadline = 1637934350

const message = utils.hexConcat([`Deadline:${deadline}|Address:`, address])
const hash = utils.hash(message)

const signature = utils.sign(hash, privateKey)

console.log({ address, deadline, message, hash, signature })


/*


    function verifySignature(
//        address _claimingAddress,
//        uint256 _deadline
//        uint8 v,
//        bytes32 r,
//        bytes32 s
    ) public view returns (address)
    {
        address _claimingAddress = 0x5408Dfe1AdD2bA2DCa93dDcA469Ff724F9fE022e;
        uint256 _deadline = 1637934350;
        uint8 v = 0x1b;
        bytes32 r = 0x7b7cc7090c789f76052c4a0c9d5b8f945b09e2574705ec7ea739a691407a127c;
        bytes32 s = 0x0e46b5500277e8ad4d2cf86110603b007e90470a89700e9e65206db6e2b9d5ac;

        bytes memory message = abi.encodePacked(
            "Deadline:", Strings.toString(_deadline), '|',
            "Address:", _claimingAddress
        );

        bytes32 hash = keccak256(message);

        return ecrecover(hash, v, r, s);
    }

 */
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface LootInterface {
    function ownerOf(uint256 _tokenId) external view returns (address owner);
}

/// @author Developer DAO
/// @title The PixelAvatars smart contract that is compliant to ERC721 standard.
/// @dev Contract under development and requires more tests.
contract PixelAvatars is ERC721Enumerable, ReentrancyGuard, Ownable {
    /// TODO: Set this to the IPFS base uri before launch
    string public baseURI =
        "https://g69d6ix8sb.execute-api.us-east-1.amazonaws.com/dev/api/tokens/";

    /// @dev Original Developer Dao Contract
    /// TODO: Change this to mainnet Developer Dao Contract
    address public devDaoAddress = 0x25ed58c027921E14D86380eA2646E3a1B5C55A8b;
    LootInterface private _devDaoContract = LootInterface(devDaoAddress);

    modifier validDevDaoToken(uint256 _devDaoTokenId) {
        require(
            _devDaoTokenId > 0 && _devDaoTokenId <= 8000,
            "Not a valid Dev DAO Token ID."
        );
        _;
    }

    modifier devDaoTokenOwnerOf(uint256 _devDaoTokenId) {
        require(
            _devDaoContract.ownerOf(_devDaoTokenId) == msg.sender,
            "Not a Dev DAO Token owner."
        );
        _;
    }

    modifier multipleDevDaoTokenOwnerOf(uint256[] memory _devDaoTokenIds) {
        for (uint256 index = 0; index < _devDaoTokenIds.length; index++) {
            require(
                _devDaoContract.ownerOf(_devDaoTokenIds[index]) == msg.sender,
                "Not a Dev DAO Token owner."
            );
        }
        _;
    }

    constructor() ERC721("Pixel Avatars", "PXLAVTR") {
        console.log("PixelAvatars deployed by '%s'", msg.sender);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /// @dev Private sale minting (reserved for DevDao owners)
    function mintWithDevDaoToken(uint256 _devDaoTokenId)
        public
        nonReentrant
        validDevDaoToken(_devDaoTokenId)
        devDaoTokenOwnerOf(_devDaoTokenId)
    {
        console.log(
            "mintWithDevDaoToken | _devDaoTokenId '%s'",
            _devDaoTokenId
        );

        _safeMint(msg.sender, _devDaoTokenId);
    }

    function multiMintWithDevDaoToken(uint256[] memory _devDaoTokenIds)
        public
        nonReentrant
        multipleDevDaoTokenOwnerOf(_devDaoTokenIds)
    {
        for (uint256 index = 0; index < _devDaoTokenIds.length; index++) {
            uint256 devDaoTokenId = _devDaoTokenIds[index];

            console.log(
                "multiMintWithDevDaoToken | minting '%s' ...",
                devDaoTokenId
            );

            _safeMint(_msgSender(), devDaoTokenId);

            console.log(
                "multiMintWithDevDaoToken | '%s' minted",
                devDaoTokenId
            );
        }
    }
}

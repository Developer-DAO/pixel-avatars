// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
    address public DevDaoAddress = 0x25ed58c027921E14D86380eA2646E3a1B5C55A8b;
    LootInterface DevDaoContract = LootInterface(DevDaoAddress);

    constructor() ERC721("Pixel Avatars", "PXLAVTR") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /// @dev Private sale minting (reserved for DevDao owners)
    function mintWithDevDaoToken(uint256 _devDaoTokenId) public nonReentrant {
        require(
            _devDaoTokenId > 0 && _devDaoTokenId <= 8000,
            "Not a valid DevDaoToken ID. Did you mean to use the regular mint function?"
        );
        require(
            DevDaoContract.ownerOf(_devDaoTokenId) == msg.sender,
            "Not this DevDaoToken's owner"
        );

        _safeMint(msg.sender, _devDaoTokenId);
    }

    function multiMintWithDevDaoToken(uint256[] memory _devDaoTokenIds)
        public
        nonReentrant
    {
        for (uint256 i = 0; i < _devDaoTokenIds.length; i++) {
            require(
                DevDaoContract.ownerOf(_devDaoTokenIds[i]) == msg.sender,
                "Not this Dao Token's owner"
            );
            _safeMint(_msgSender(), _devDaoTokenIds[i]);
        }
    }
}

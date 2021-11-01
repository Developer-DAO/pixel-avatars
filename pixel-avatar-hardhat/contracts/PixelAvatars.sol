// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        "ipfs://QmUVH51tigyENzwUhsTv14dV7eyaVo6oHoeCD3JHD9rFnV/";

    /// @dev Original Developer Dao Contract
    /// TODO: Change this to mainnet Developer Dao Contract
    address public devDaoAddress = 0x25ed58c027921E14D86380eA2646E3a1B5C55A8b;
    uint256 public mintPrice = 0.01 ether;

    LootInterface private _devDaoContract = LootInterface(devDaoAddress);

    //TODO Do we need this when we're not allowing public minting?
    modifier validDevDaoToken(uint256 _devDaoTokenId) {
        require(
            _devDaoTokenId > 0 && _devDaoTokenId <= 8000,
            "Not a valid Developer DAO Token ID."
        );
        _;
    }

    modifier devDaoTokenOwnerOf(uint256 _devDaoTokenId) {
        require(
            _devDaoContract.ownerOf(_devDaoTokenId) == msg.sender,
            "Not a Developer DAO Token owner."
        );
        _;
    }

    modifier multipleDevDaoTokenOwnerOf(uint256[] memory _devDaoTokenIds) {
        for (uint256 index = 0; index < _devDaoTokenIds.length; index++) {
            require(
                _devDaoContract.ownerOf(_devDaoTokenIds[index]) == msg.sender,
                "Not a Developer DAO Token owner."
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

    event LogTokenMinted(address minter, uint256 tokenId);

    /// @dev Private sale minting (reserved for DevDao owners)
    function mintWithDevDaoToken(uint256 _devDaoTokenId)
        public
        payable
        nonReentrant
        validDevDaoToken(_devDaoTokenId)
        devDaoTokenOwnerOf(_devDaoTokenId)
    {
        require(mintPrice <= msg.value, "Not enough ether sent");
        console.log(
            "mintWithDevDaoToken | _devDaoTokenId '%s'",
            _devDaoTokenId
        );

        _safeMint(msg.sender, _devDaoTokenId);
        emit LogTokenMinted(msg.sender, _devDaoTokenId);
    }

    // provide Mint price in wei
    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function multiMintWithDevDaoToken(uint256[] memory _devDaoTokenIds)
        public
        payable
        nonReentrant
        multipleDevDaoTokenOwnerOf(_devDaoTokenIds)
    {
        require(
            (mintPrice * _devDaoTokenIds.length) <= msg.value,
            "Ether value sent is not correct"
        );

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

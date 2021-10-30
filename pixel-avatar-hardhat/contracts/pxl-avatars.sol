import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


// File: contracts/pixel-avatar.sol

// License-Identifier: MIT



pragma solidity ^0.8.7;

interface AvatarInterface {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract PixelAvatars is ERC721Enumerable, ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    // TODO: set this to the ipfs base uri before launch
    string public baseURI =
        "ipfs://QmUVH51tigyENzwUhsTv14dV7eyaVo6oHoeCD3JHD9rFnV/";

    //Original Developer Dao Contract
    address public devDaoAddress = 0x25ed58c027921E14D86380eA2646E3a1B5C55A8b; // TODO: Change this to mainnet Developer Dao Contract
    AvatarInterface devDaoContract = AvatarInterface(devDaoAddress);

    constructor() ERC721("Pixel Avatars", "PXLAVTR") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

  

    //Private sale minting (reserved for DevDao owners)
    function mintWithDevDaoToken(uint256 devDaoTokenId)
        public
        nonReentrant
    {
        require(
            devDaoTokenId > 0 && devDaoTokenId <= 8000,
            "Not a valid DevDaoToken ID"
        );
        require(
            devDaoContract.ownerOf(devDaoTokenId) == msg.sender,
            "Not this DevDaoToken's owner"
        );

        _safeMint(msg.sender, devDaoTokenId);
    }

    
    function multiMintWithDevDaoToken(uint256[] memory devDaoTokenIds)
        public
        nonReentrant
    {
        for (uint256 i = 0; i < devDaoTokenIds.length; i++) {
            require(
                devDaoContract.ownerOf(devDaoTokenIds[i]) == msg.sender,
                "Not this Dao Token's owner"
            );
            _safeMint(_msgSender(), devDaoTokenIds[i]);
        }
    }
}

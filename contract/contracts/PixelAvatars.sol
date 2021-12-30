// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';

/// @author Developer DAO
/// @title The Pixel Avatar smart contract that is compliant to ERC721 standard.
contract PixelAvatars is ERC721Enumerable, ReentrancyGuard, Ownable {
    /// TODO: Set this to the IPFS base uri before launch
    string public baseURI =
        'ipfs://QmUVH51tigyENzwUhsTv14dV7eyaVo6oHoeCD3JHD9rFnV/';

    uint256 public mintPrice = 6 ether;

    address public serverAddress;

    constructor() ERC721('Pixel Avatars', 'PXLAVTR') {
        console.log("PixelAvatars deployed by '%s'", msg.sender);
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setMintPrice(uint256 _newPrice) public onlyOwner {
        // Mint price in wei
        mintPrice = _newPrice;
    }

    function setServerAddress(address _address) public onlyOwner {
        serverAddress = _address;
    }

    event LogTokenMinted(address minter, uint256 tokenId);

    modifier validServerSignature(
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) {
        bytes memory message = abi.encodePacked(
            'TokenId:',
            Strings.toString(tokenId),
            'Address:',
            msg.sender,
            'Deadline:',
            Strings.toString(deadline)
        );

        address signer = ecrecover(keccak256(message), v, r, s);

        require(signer == serverAddress, string('Invalid server signature'));
        require(block.timestamp <= deadline, 'Signature expired');

        _;
    }

    function mintWithSignature(
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        public
        payable
        nonReentrant
        validServerSignature(tokenId, deadline, v, r, s)
    {
        require(mintPrice <= msg.value, 'Not enough ether sent');

        _safeMint(msg.sender, tokenId);

        emit LogTokenMinted(msg.sender, tokenId);
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}

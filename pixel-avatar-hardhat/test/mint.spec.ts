import { expect } from "chai";
import { ethers } from "hardhat";
import { PixelAvatars } from "../typechain";
const utils = require("../../web-server/src/utils");

describe("PixelAvatars", function () {
  let contract: PixelAvatars;

  beforeEach(async () => {
    const contractFactory = await ethers.getContractFactory("PixelAvatars");
    contract = await contractFactory.deploy();
    console.log("Contract deployed at", contract.address);
  });

  describe("mint", () => {
    it("should mint a token", async () => {
      // hardhat account that deployed contract
      const [signer] = await ethers.getSigners();
      expect(signer.address.toLowerCase()).to.be.equal(
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266".toLowerCase()
      );
      // no worries here checking in this test private key.
      // It's part of the hardhat network test accounts and is not secret.
      const PRIVATE_KEY =
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      const address = signer.address;

      // data returned from web server
      const tokenId = 6300;
      const AUTHORIZATION_LIFETIME_SECONDS = 5 * 60;

      const deadline =
        Math.round(Date.now() / 1000) + AUTHORIZATION_LIFETIME_SECONDS;

      const message = utils.hexConcat([
        "TokenId:",
        tokenId.toString(),
        "Address:",
        address,
        "Deadline:",
        deadline.toString(),
      ]);
      const hash = utils.hash(message);
      const signature = utils.sign(hash, PRIVATE_KEY);

      console.log("tokenId", tokenId);
      console.log("deadline", deadline);
      console.log("signature", signature);

      const split = ethers.utils.splitSignature(signature);

      await contract.setServerAddress(contract.address);

      await expect(
        contract.mintWithSignature(tokenId, deadline, split.v, split.r, split.s)
      ).emit(contract, "LogTokenMinted");
    });
  });
});

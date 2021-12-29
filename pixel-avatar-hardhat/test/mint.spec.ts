import { expect } from "chai";
import { ethers } from "hardhat";
import { PixelAvatars } from "../typechain";
const utils = require("../../web-server/src/utils");

describe("PixelAvatars", function () {
  let contract: PixelAvatars;

  beforeEach(async () => {
    const contractFactory = await ethers.getContractFactory("PixelAvatars");
    contract = await contractFactory.deploy();
  });

  describe("mintWithSignature()", () => {
    it("should mint a token when given proper auth and minimum ether", async () => {
      const [signer] = await ethers.getSigners();
      const address = signer.address;

      // these test keys generated via `node web-server/cli/generate-keys.js`
      const PRIVATE_KEY =
        "8ef55fc4bb8f066ada9a9f1cbf6f09ff8a1ed9b168c9eeec0ca0a8fda8b309fd";
      const serverAddress = "0x9788f6B80e3b856bb420eDf05D352f474be733a5";

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

      const split = ethers.utils.splitSignature(signature);

      await contract.setServerAddress(serverAddress);

      await expect(
        contract.mintWithSignature(
          tokenId,
          deadline,
          split.v,
          split.r,
          split.s,
          {
            value: ethers.utils.parseEther("6"),
          }
        )
      ).emit(contract, "LogTokenMinted");
    });
  });
});

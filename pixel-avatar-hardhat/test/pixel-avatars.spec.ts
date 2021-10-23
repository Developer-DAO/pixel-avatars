import { expect } from "chai";
import { ethers } from "hardhat";
import { PixelAvatars } from "../typechain";

describe("PixelAvatars", function () {
  let contract: PixelAvatars;

  beforeEach(async () => {
    const PixelAvatars = await ethers.getContractFactory("PixelAvatars");
    contract = await PixelAvatars.deploy();
  });

  it("Should return the new greeting once it's changed", async function () {
    await contract.deployed();

    expect(await contract.deployed()).to.be.not.undefined.and.to.be.not.null;
  });

  describe("mintWithDevDaoToken", () => {
    describe("modifier: validDevDaoToken", async () => {
      it("should revert when given an invalid DevDAO token ID", async () => {
        await expect(contract.mintWithDevDaoToken(8001)).to.be.revertedWith(
          "Not a valid Developer DAO Token ID."
        );
      });

      it("should revert when given a DevDAO token ID of 0", async () => {
        await expect(contract.mintWithDevDaoToken(0)).to.be.revertedWith(
          "Not a valid Developer DAO Token ID."
        );
      });

      it("should not revert when given a valid DevDAO token ID", async () => {
        await expect(contract.mintWithDevDaoToken(6300)).not.to.be.revertedWith(
          "Not a valid Developer DAO Token ID."
        );
      });
    });

    describe("modifier: devDaoTokenOwnerOf", () => {
      it("should revert when given a DevDAO token ID that isn't the owner", async () => {
        await expect(contract.mintWithDevDaoToken(6300)).to.be.revertedWith(
          "Not a Developer DAO Token owner."
        );
      });
    });
  });
});

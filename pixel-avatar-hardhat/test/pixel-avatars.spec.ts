import { expect } from "chai";
import { ethers } from "hardhat";

describe("PixelAvatars", function () {
  it("Should return the new greeting once it's changed", async function () {
    const PixelAvatars = await ethers.getContractFactory("PixelAvatars");
    const pixelAvatars = await PixelAvatars.deploy();
    await pixelAvatars.deployed();

    expect(await pixelAvatars.deployed()).to.be.not.undefined.and.to.be.not
      .null;
  });
});

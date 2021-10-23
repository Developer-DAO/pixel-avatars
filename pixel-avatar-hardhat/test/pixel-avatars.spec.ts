import { MockProvider } from "@ethereum-waffle/provider";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { PixelAvatars } from "../typechain";
import PixelAvatarsJSON from "../artifacts/contracts/PixelAvatars.sol/PixelAvatars.json";
import { MockContract } from "@ethereum-waffle/mock-contract";

describe("PixelAvatars", function () {
  const [sender, receiver] = new MockProvider().getWallets();
  let contract: PixelAvatars;
  let mockContract: MockContract;

  beforeEach(async () => {
    const contractFactory = new ethers.ContractFactory(
      PixelAvatarsJSON.abi,
      PixelAvatarsJSON.bytecode,
      sender
    );

    mockContract = await waffle.deployMockContract(
      sender,
      PixelAvatarsJSON.abi
    );
    contract = (await contractFactory.deploy()) as PixelAvatars;
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
        mockContract.mock.ownerOf.withArgs(6300).returns(false);

        await expect(contract.mintWithDevDaoToken(6300)).to.be.revertedWith(
          "Not a Developer DAO Token owner."
        );
      });
    });
  });
});

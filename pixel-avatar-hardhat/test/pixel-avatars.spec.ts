// import { MockProvider } from "@ethereum-waffle/provider";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import {
//   LootInterface,
//   PixelAvatars,
//   PixelAvatars__factory,
// } from "../typechain";
// import { MockContractFactory, smock } from "@defi-wonderland/smock";

// describe("PixelAvatars", function () {
//   const [sender, receiver] = new MockProvider().getWallets();
//   let contract: PixelAvatars;
//   let mockContract: MockContractFactory<PixelAvatars__factory>;

//   beforeEach(async () => {
//     const contractFactory = await ethers.getContractFactory("PixelAvatars");
//     contract = await contractFactory.deploy();

//     mockContract = await smock.mock<PixelAvatars__factory>("PixelAvatars");
//   });

//   describe("mintWithDevDaoToken", () => {
//     describe("modifier: validDevDaoToken", async () => {
//       it("should revert when given an invalid DevDAO token ID", async () => {
//         await expect(contract.mintWithDevDaoToken(8001)).to.be.revertedWith(
//           "Not a valid Developer DAO Token ID."
//         );
//       });

//       it("should revert when given a DevDAO token ID of 0", async () => {
//         await expect(contract.mintWithDevDaoToken(0)).to.be.revertedWith(
//           "Not a valid Developer DAO Token ID."
//         );
//       });

//       it("should not revert when given a valid DevDAO token ID", async () => {
//         await expect(contract.mintWithDevDaoToken(6300)).not.to.be.revertedWith(
//           "Not a valid Developer DAO Token ID."
//         );
//       });
//     });

//     describe("modifier: devDaoTokenOwnerOf", () => {
//       /** Use forked Mainnet for testing this */
//       it("...", async () => {
//         // const devDaoTokenOwner = await ethers.getSigner(
//         //   "0x3E8c686F499C877D8f4aFB1215b6f0935796b986"
//         // );
//         // const fakeLootInterface = await smock.fake<LootInterface>(
//         //   "LootInterface"
//         // );
//         // fakeLootInterface.ownerOf.whenCalledWith(6300).returns(true);
//         // const fakePixelAvatars = await smock.fake("PixelAvatars", {
//         //   address: devDaoTokenOwner.address,
//         // });
//         // contract = contract.connect(fakePixelAvatars.wallet);

//         await expect(
//           contract.mintWithDevDaoToken(6300, {
//             value: ethers.utils.parseEther("0.5"),
//           })
//         ).emit(contract, "LogTokenMinted");
//       });
//     });
//   });
// });

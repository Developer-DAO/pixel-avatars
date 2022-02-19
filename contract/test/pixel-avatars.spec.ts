import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'
import { BigNumberish, Signature } from 'ethers'
import { PixelAvatars } from '../typechain'

const utils = require('../../web-server/src/utils')

describe('PixelAvatars contract', function () {
    let contract: PixelAvatars

    beforeEach(async () => {
        const Contract = await ethers.getContractFactory('PixelAvatars')
        contract = (await upgrades.deployProxy(Contract)) as PixelAvatars
        await contract.deployed()
    })

    describe('helper functions', function () {
        it('should successfully setBaseURI', async () => {
            const newURI = 'ipfs://testuri'
            await contract.setBaseURI(newURI)
            await expect(await contract.baseURI()).to.equal(newURI)
        })

        it('should successfully set and retrieve MintPrice', async () => {
            const newMintPrice = 10
            await contract.setMintPrice(newMintPrice)
            await expect(await contract.mintPrice()).to.equal(newMintPrice)
        })
    })

    describe('mintWithSignature()', function () {
        describe('without auth', function () {
            it('should fail', async () => {
                const tokenId = 6300
                const deadline = 0
                const v = '0x1b'
                const r =
                    '0xfd3a030273cf43afadb504375fcf378003c506ae8aad2c5b651e832af7e87012'
                const s =
                    '0x2f86d81471da2a7077229fd7804536c19166496813aeeea31bb603e16fbf828b'

                await expect(
                    contract.mintWithSignature(tokenId, deadline, v, r, s, {
                        value: ethers.utils.parseEther('6'),
                    })
                ).to.be.revertedWith('Invalid server signature')
            })
        })

        describe('with proper auth', function () {
            let tokenId: BigNumberish
            let deadline: number
            let split: Signature

            beforeEach(async () => {
                const [signer] = await ethers.getSigners()
                const address = signer.address

                // these test keys generated via `node web-server/cli/generate-keys.js`
                const PRIVATE_KEY =
                    '8ef55fc4bb8f066ada9a9f1cbf6f09ff8a1ed9b168c9eeec0ca0a8fda8b309fd'
                const serverAddress =
                    '0x9788f6B80e3b856bb420eDf05D352f474be733a5'

                // data returned from web server
                tokenId = 6300
                const AUTHORIZATION_LIFETIME_SECONDS = 5 * 60

                deadline =
                    Math.round(Date.now() / 1000) +
                    AUTHORIZATION_LIFETIME_SECONDS

                const message = utils.hexConcat([
                    'TokenId:',
                    tokenId.toString(),
                    'Address:',
                    address,
                    'Deadline:',
                    deadline.toString(),
                ])
                const hash = utils.hash(message)
                const signature = utils.sign(hash, PRIVATE_KEY)

                split = ethers.utils.splitSignature(signature)

                await contract.setServerAddress(serverAddress)
            })

            it('should fail if not enough eth sent', async () => {
                await expect(
                    contract.mintWithSignature(
                        tokenId,
                        deadline,
                        split.v,
                        split.r,
                        split.s
                    )
                ).to.be.revertedWith('Not enough MATIC sent')
            })

            it('should fail if deadline expires', async () => {
                // Test Setup:
                //
                // Needed to reuse most of the beforeEach() boilerplate
                // since deadline is part of the signed message

                const [signer] = await ethers.getSigners()
                const address = signer.address

                // these test keys generated via `node web-server/cli/generate-keys.js`
                const PRIVATE_KEY =
                    '8ef55fc4bb8f066ada9a9f1cbf6f09ff8a1ed9b168c9eeec0ca0a8fda8b309fd'
                const serverAddress =
                    '0x9788f6B80e3b856bb420eDf05D352f474be733a5'

                // data returned from web server
                tokenId = 6300

                deadline = 0

                const message = utils.hexConcat([
                    'TokenId:',
                    tokenId.toString(),
                    'Address:',
                    address,
                    'Deadline:',
                    deadline.toString(),
                ])
                const hash = utils.hash(message)
                const signature = utils.sign(hash, PRIVATE_KEY)

                split = ethers.utils.splitSignature(signature)

                await contract.setServerAddress(serverAddress)

                await expect(
                    contract.mintWithSignature(
                        tokenId,
                        deadline,
                        split.v,
                        split.r,
                        split.s
                    )
                ).to.be.revertedWith('Signature expired')
            })

            it('should mint a token when given minimum ether', async () => {
                await expect(
                    contract.mintWithSignature(
                        tokenId,
                        deadline,
                        split.v,
                        split.r,
                        split.s,
                        {
                            value: ethers.utils.parseEther('12'),
                        }
                    )
                ).emit(contract, 'LogTokenMinted')
            })

            it('owner should be able to withdraw full balance of eth', async () => {
                const [signer] = await ethers.getSigners()
                const initialBalance = await signer.getBalance()

                // initial eth (rounded off to avoid including gas fee)
                await expect(
                    parseInt(ethers.utils.formatEther(initialBalance), 10)
                ).to.equal(9987)

                await contract.mintWithSignature(
                    tokenId,
                    deadline,
                    split.v,
                    split.r,
                    split.s,
                    {
                        value: ethers.utils.parseEther('200'),
                    }
                )
                // should be approx 200 more eth (rounded off to avoid including gas fee)
                const balanceAfterPayingEth = await signer.getBalance()
                await expect(
                    parseInt(
                        ethers.utils.formatEther(balanceAfterPayingEth),
                        10
                    )
                ).to.equal(9787)

                // should be approx 200 eth less after withdrawal (rounded off to avoid including gas fee)
                await contract.withdraw()
                const balanceAfterWithdrawal = await signer.getBalance()
                await expect(
                    parseInt(
                        ethers.utils.formatEther(balanceAfterWithdrawal),
                        10
                    )
                ).to.equal(9987)
            })
        })
    })
})

import axios from 'axios'
import PixelAvatarContract from '../../../../abis/PixelAvatars.json'
import { inject } from 'vue'
import { PIXEL_AVATAR_TOKEN, SERVER_URL } from '../../constants'
import { ethers } from 'ethers'

export default function useAvatarContract() {
    const client = inject('web3client')

    let cachedMintPrice = null

    return {
        async claim(token) {
            const response = (
                await axios.post(
                    `${SERVER_URL}/owners/${client.connectedAddress.value}/authorize`,
                    {
                        tokenId: token,
                    }
                )
            ).data.data

            const transaction = await client
                .contract(PIXEL_AVATAR_TOKEN, PixelAvatarContract.abi)
                .mintWithSignature(
                    response.tokenId,
                    response.deadline,
                    response.signature.v,
                    response.signature.r,
                    response.signature.s,
                    {
                        value: await this.getMintPrice(),
                    }
                )
                .catch(normalizeContractError)

            await transaction.wait().catch(normalizeContractError)
        },

        async getAvailableTokens() {
            const response = await axios.get(
                `${SERVER_URL}/owners/${client.connectedAddress.value}/inventory`
            )

            return response.data.data
        },

        async getMintPrice() {
            if (!cachedMintPrice) {
                cachedMintPrice = await client
                    .contract(PIXEL_AVATAR_TOKEN, PixelAvatarContract.abi)
                    .mintPrice()
                    .catch(normalizeContractError)
            }

            return cachedMintPrice
        },

        async getMintPriceInEther() {
            return ethers.utils.formatEther(await this.getMintPrice())
        },
    }
}

function normalizeContractError(error) {
    throw new Error(
        null ??
            error?.error?.data?.originalError?.message ??
            error?.error?.message ??
            error?.data?.message ??
            error?.message
    )
}

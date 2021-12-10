import { computed, ref } from 'vue'
import { PIXEL_AVATAR_TOKEN, SERVER_URL } from '../constants'
import PixelAvatarContract from '../../../abis/PixelAvatars.json'
import useWeb3Provider from './useWeb3Provider'
import axios from 'axios'

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref(null)
    const isConnected = computed(() => address.value !== null)
    const web3 = useWeb3Provider()
    let mintPrice = null

    function avatarContract() {
        return web3.contract(PIXEL_AVATAR_TOKEN, PixelAvatarContract.abi)
    }

    async function fetchOwnedTokens() {
        const response = await axios.get(
            `${SERVER_URL}/owners/${address.value}/inventory`
        )

        tokens.value = response.data.data
    }

    function normalizeError(error) {
        throw new Error(
            null ??
                error?.error?.data?.originalError?.message ??
                error?.error?.message ??
                error?.data?.message ??
                error?.message
        )
    }

    return {
        address,
        isConnected,
        tokens,

        async connect(providerName) {
            await web3.switch(providerName)

            address.value = await web3.instance().connect()

            await fetchOwnedTokens()
        },

        async disconnect() {
            await web3.instance().disconnect()

            address.value = null
            tokens.value = null
        },

        async claim(token) {
            const response = (
                await axios.post(
                    `${SERVER_URL}/owners/${address.value}/authorize`,
                    {
                        tokenId: token,
                    }
                )
            ).data.data

            const transaction = await avatarContract()
                .mintWithSignature(
                    response.tokenId,
                    response.deadline,
                    response.signature.v,
                    response.signature.r,
                    response.signature.s,
                    {
                        value: this.getMintPrice(),
                    }
                )
                .catch(normalizeError)

            await transaction.wait().catch(normalizeError)
        },

        async getMintPrice() {
            if (!mintPrice) {
                mintPrice = await avatarContract()
                    .mintPrice()
                    .catch(normalizeError)
            }

            return mintPrice
        },
    }
}

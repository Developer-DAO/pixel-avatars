import { computed, ref } from 'vue'
import { ethers } from 'ethers'
import {
    GENESIS_CONTRACT,
    NETWORK,
    PIXEL_AVATAR_CONTRACT,
} from '../constants/adresses'
import GenesisContract from '../contracts/GenesisContract.json'
import PixelAvatarContract from '../contracts/PixelAvatars.json'

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref(null)
    const isConnected = computed(() => address.value !== null)

    return {
        address,
        isConnected,
        tokens,

        async connect() {
            const [_address] = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            address.value = _address
            await this.fetchOwnersTokens()
        },

        async fetchOwnersTokens() {
            if (address.value === null) {
                alert('Please connect to wallet and select an account')
                return
            }
            const provider = new ethers.providers.Web3Provider(
                window.ethereum,
                NETWORK
            )

            const genesisContract = new ethers.Contract(
                GENESIS_CONTRACT,
                GenesisContract.abi,
                provider
            )

            // Number of tokens owned by the address
            const balance = (
                await genesisContract.balanceOf(address.value)
            ).toNumber()

            // For each token the address owns we need to fetch the actual nft
            const tokenPromises = [...Array(balance).keys()].map((idx) =>
                genesisContract.tokenOfOwnerByIndex(address.value, idx)
            )

            const _tokens = await Promise.all(tokenPromises)

            tokens.value = _tokens.map((t) => t.toString())
        },

        disconnect() {
            address.value = null
            tokens.value = null
        },

        async claim(token) {
            const provider = new ethers.providers.Web3Provider(
                window.ethereum,
                NETWORK
            )

            const signer = provider.getSigner()

            const avatarContract = new ethers.Contract(
                PIXEL_AVATAR_CONTRACT,
                PixelAvatarContract.abi,
                signer
            )

            const transaction = await avatarContract.mintWithDevDaoToken(
                token,
                {
                    value: ethers.utils.parseEther('0.1'),
                }
            )

            await transaction.wait()
        },
    }
}

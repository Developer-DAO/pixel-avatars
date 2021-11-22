import { computed, ref } from 'vue'
import { ethers } from 'ethers'
import { GENESIS_CONTRACT, PIXEL_AVATAR_CONTRACT } from '../constants/adresses'
import GenesisContract from '../contracts/GenesisContract.json'
import PixelAvatarContract from '../contracts/PixelAvatars.json'
import useWeb3Provider from './useWeb3Provider'

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref(null)
    const isConnected = computed(() => address.value !== null)
    const web3 = useWeb3Provider()

    return {
        address,
        isConnected,
        tokens,

        async connect(providerName) {
            await web3.switch(providerName)

            address.value = await web3.instance().connect()

            await this._fetchOwnedTokens()
        },

        async disconnect() {
            await web3.instance().disconnect()

            address.value = null
            tokens.value = null
        },

        async claim(token) {
            const avatarContract = web3.contract(
                PIXEL_AVATAR_CONTRACT,
                PixelAvatarContract.abi
            )

            const transaction = await avatarContract.mintWithDevDaoToken(
                token,
                {
                    value: ethers.utils.parseEther('0.1'),
                }
            )

            await transaction.wait()
        },

        async _fetchOwnedTokens() {
            const genesisContract = web3.contract(
                GENESIS_CONTRACT,
                GenesisContract.abi
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
    }
}

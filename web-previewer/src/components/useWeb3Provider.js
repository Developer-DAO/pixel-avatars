import { ref } from 'vue'
import { ethers } from 'ethers'
import { PIXEL_AVATAR_NETWORK } from '../constants'
import MetaMask from '../web3-providers/MetaMask'
import WalletConnect from '../web3-providers/WalletConnect'

export const SUPPORTED_PROVIDERS = Object.freeze({
    META_MASK: 'META_MASK',
    WALLET_CONNECT: 'WALLET_CONNECT',
})

export default function useWeb3Provider() {
    const providers = {
        [SUPPORTED_PROVIDERS.META_MASK]: new MetaMask(),
        [SUPPORTED_PROVIDERS.WALLET_CONNECT]: new WalletConnect(),
    }

    const activeInstance = ref(null)

    return {
        async switch(name) {
            if (activeInstance.value) {
                await activeInstance.value.disconnect()
            }

            activeInstance.value = providers[name]

            // Reload on network change
            this.instance().provider.on('chainChanged', () => {
                window.location.reload()
            })

            return this
        },

        contract(token, contract) {
            const provider = this.provider()

            return new ethers.Contract(token, contract, provider.getSigner())
        },

        instance() {
            if (!activeInstance.value) {
                throw Error(
                    'No active web3 provider instance. Please connect first.'
                )
            }

            return activeInstance.value
        },

        provider() {
            return new ethers.providers.Web3Provider(
                this.instance().provider,
                PIXEL_AVATAR_NETWORK
            )
        },
    }
}

import { ref } from 'vue'
import { ethers } from 'ethers'
import { NETWORK } from '../constants/adresses'
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

            return this
        },

        contract(token, contract) {
            const provider = new ethers.providers.Web3Provider(
                this.instance().provider,
                NETWORK
            )

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
    }
}

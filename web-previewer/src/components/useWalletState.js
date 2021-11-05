import { computed, ref } from 'vue'
import Web3 from 'web3'

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref(null)
    const isConnected = computed(() => address.value !== null)

    return {
        address,
        isConnected,
        tokens,

        async connect() {
            if (!window.ethereum) {
                alert(
                    'MetaMask not detected. Please try again from a MetaMask enabled browser.'
                )

                return
            }

            const web3 = new Web3(window.ethereum)

            address.value = (await web3.eth.requestAccounts())[0]

            // TODO - detect tokens from genesis contract
            tokens.value = [123, 234, 345, 456]
        },

        disconnect() {
            address.value = null
            tokens.value = []
        },

        claim(token) {},
    }
}

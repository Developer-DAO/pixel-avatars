import {computed, ref} from 'vue'
import {ethers} from "ethers";


export default function useWalletState() {
    const address = ref(null)
    const tokens = ref([])
    const provider = ref(null);
    const isConnected = computed(() => address.value !== null)

    return {
        address,
        isConnected,
        tokens,

        async connect() {
            const [_address] = await window.ethereum.request({method: "eth_requestAccounts"})
            provider.value = new ethers.providers.Web3Provider(window.ethereum);
            address.value = _address
            console.log(address)
        },

        disconnect() {
            address.value = null
            tokens.value = []
        },

        claim(token) {
        },
    }
}

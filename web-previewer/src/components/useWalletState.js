import {computed, ref} from 'vue'
import {ethers} from "ethers";
import {GENESIS_CONTRACT} from "../constants/adresses";
import GenesisContract from "./../GenesisContract.json";

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref([])
    const isConnected = computed(() => address.value !== null)

    return {
        address,
        isConnected,
        tokens,

        async connect() {
            const [_address] = await window.ethereum.request({method: "eth_requestAccounts"})
            address.value = _address
            await this.fetchOwnersTokens();
        },

        async fetchOwnersTokens() {
            if (address === null) {
                console.log("please connect to wallet and select an account");
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            //developer dao contract
            const contract = new ethers.Contract(GENESIS_CONTRACT, GenesisContract.abi, provider);

            //number of tokens owned by the address
            const balance = await contract.balanceOf(address.value)

            //For each token the address owns we need to fetch the actual nft
            const tokenPromises = [...Array(balance).keys()].map(idx => contract.tokenOfOwnerByIndex(address.value, idx));

            //await all async calls
            const _tokens = await Promise.all(tokenPromises);

            //map them to string
            tokens.value = _tokens.map(t => t.toString());

        },

        disconnect() {
            address.value = null
            tokens.value = []
        },

        claim(token) {
        },
    }
}

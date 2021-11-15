import {computed, ref} from 'vue'
import {ethers} from "ethers";
import {GENESIS_CONTRACT, INFURA_ID, NETWORK, PIXEL_AVATAR_CONTRACT} from "../constants/adresses";
import GenesisContract from "../contracts/GenesisContract.json";
import PixelAvatarContract from "../contracts/PixelAvatars.json";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref([])
    const isConnected = computed(() => address.value !== null)

    return {
        address,
        isConnected,
        tokens,

        async connectWithMetamask() {
            const [_address] = await window.ethereum.request({method: "eth_requestAccounts"})
            address.value = _address
            const metaMaskProvider = window.ethereum;
            await this.fetchOwnersTokens(metaMaskProvider);
        },

        async connectWithWalletConnect() {
            const walletConnectProvider = new WalletConnectProvider({
                infuraId: INFURA_ID
            });

            await walletConnectProvider.enable();
            const [_address] = walletConnectProvider.accounts;
            address.value = _address;
            await this.fetchOwnersTokens(walletConnectProvider);
        },

        async fetchOwnersTokens(provider) {
            if (address.value === null) {
                console.log("please connect to wallet and select an account");
                return;
            }
            const web3Provider = new ethers.providers.Web3Provider(provider, NETWORK);

            //developer dao contract
            const contract = new ethers.Contract(GENESIS_CONTRACT, GenesisContract.abi, web3Provider);

            //number of tokens owned by the address
            const balance = (await contract.balanceOf(address.value)).toNumber();

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

        async claim(token) {
            const provider = new ethers.providers.Web3Provider(window.ethereum, NETWORK);

            const signer = provider.getSigner();


            //pixel avatar contract
            const contract = new ethers.Contract(PIXEL_AVATAR_CONTRACT, PixelAvatarContract.abi, signer);

            const transaction = await contract.mintWithDevDaoToken(token, {value: ethers.utils.parseEther("0.1")});
            await transaction.wait()

        },
    }
}

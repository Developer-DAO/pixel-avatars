import {computed, ref} from 'vue'
import {ethers} from 'ethers';
import {GENESIS_CONTRACT, NETWORK, PIXEL_AVATAR_CONTRACT} from '../constants/adresses';
import GenesisContract from '../contracts/GenesisContract.json';
import PixelAvatarContract from '../contracts/PixelAvatars.json';
import {WalletProvider} from './WalletProvider';

export default function useWalletState() {
    const address = ref(null)
    const tokens = ref(null)
    const isConnected = computed(() => address.value !== null)

    const walletProvider = new WalletProvider();

    return {
        address,
        isConnected,
        tokens,

        async connect(kind) {
            await walletProvider.connect(kind);
            const {_address, impl} = walletProvider.selectecWalletProvider;
            address.value = _address
            await this.fetchOwnersTokens(impl);
        },


        async fetchOwnersTokens(provider) {
            if (address.value === null) {
                alert('please connect to wallet and select an account');
                return;
            }
            const web3Provider = new ethers.providers.Web3Provider(provider, NETWORK);


            const genesisContract = new ethers.Contract(GENESIS_CONTRACT, GenesisContract.abi, web3Provider);

            //Number of tokens owned by the address
            const balance = (await genesisContract.balanceOf(address.value)).toNumber();

            //For each token the address owns we need to fetch the actual nft
            const tokenPromises = [...Array(balance).keys()].map(idx =>
                genesisContract.tokenOfOwnerByIndex(address.value, idx)
            );

            const _tokens = await Promise.all(tokenPromises);

            tokens.value = _tokens.map(t => t.toString());

        },

        async disconnect() {
            await walletProvider.disconnect();
            address.value = null;
            tokens.value = null;
        },

        async claim(token) {
            const provider = new ethers.providers.Web3Provider(window.ethereum, NETWORK);


            const signer = provider.getSigner();


            //pixel avatar contract
            const avatarContract = new ethers.Contract(PIXEL_AVATAR_CONTRACT, PixelAvatarContract.abi, signer);

            const transaction = await avatarContract.mintWithDevDaoToken(token,
                {
                    value: ethers.utils.parseEther('0.1')
                });
            await transaction.wait()

        },
    }
}




import { PIXEL_AVATAR_NETWORK } from '../constants'

export default class MetaMask {
    constructor() {
        this.provider = window.ethereum
    }

    async connect(triggerPrompt = false) {
        if (triggerPrompt) {
            await this.provider.request({
                method: 'wallet_requestPermissions',
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            })
        }

        const [address] = await this.provider.request({
            method: 'eth_requestAccounts',
        })

        return address
    }

    async disconnect() {
        //
    }

    async changeNetwork() {
        const chainId = '0x' + PIXEL_AVATAR_NETWORK.chainId.toString(16)

        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: chainId,
                    },
                ],
            })
        } catch (switchError) {
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: chainId,
                        chainName: PIXEL_AVATAR_NETWORK.name,
                        rpcUrls: [PIXEL_AVATAR_NETWORK.ensAddress],
                        nativeCurrency: {
                            name: PIXEL_AVATAR_NETWORK.currencySymbol,
                            symbol: PIXEL_AVATAR_NETWORK.currencySymbol,
                            decimals: 18,
                        },
                        blockExplorerUrls: [PIXEL_AVATAR_NETWORK.blockExplorer],
                    },
                ],
            })
        }
    }

    static isAvailable() {
        return typeof window.ethereum !== 'undefined'
    }
}

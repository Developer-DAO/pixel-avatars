import WalletConnectProvider from '@walletconnect/web3-provider'
import { INFURA_ID, PIXEL_AVATAR_NETWORK } from '../constants'

export default class WalletConnect {
    constructor() {
        this.provider = null
    }

    async connect() {
        this.provider = new WalletConnectProvider({
            infuraId: INFURA_ID,
            rpc: {
                [PIXEL_AVATAR_NETWORK.chainId]: PIXEL_AVATAR_NETWORK.ensAddress,
            },
        })

        await this.provider.enable()

        return this.provider.accounts[0] ?? null
    }

    async disconnect() {
        if (this.provider) {
            await this.provider.disconnect()

            // It seems that Wallet Connect needs to wait a second before it fully disconnects.
            // This is necessary in case we try to connect again immediately afterwards.
            await new Promise((resolve) => setTimeout(resolve, 500))
        }

        this.provider = null
    }

    async changeNetwork() {
        alert(
            'This method is currently only supported using MetaMask Chrome extension. Please change network manually and reconnect.'
        )
    }
}

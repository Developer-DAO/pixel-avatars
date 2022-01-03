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
        }

        this.provider = null
    }

    async changeNetwork() {
        throw Error('Unsupported action')
    }
}

import WalletConnectProvider from '@walletconnect/web3-provider'
import { INFURA_ID } from '../config'

export default class WalletConnect {
    constructor() {
        this.provider = null
    }

    async connect() {
        this.provider = new WalletConnectProvider({
            infuraId: INFURA_ID,
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
}

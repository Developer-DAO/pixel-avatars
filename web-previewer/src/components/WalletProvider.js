import WalletConnectProvider from "@walletconnect/web3-provider";
import {INFURA_ID} from "../constants/adresses";

export class WalletProvider {
    static SUPPORTED_PROVIDERS = Object.freeze({
        "META_MASK": "META_MASK",
        "WALLET_CONNECT": "WALLET_CONNECT"
    })

    constructor() {
        this._setInitialState();
    }

    _setInitialState() {
        this.selectecWalletProvider = {
            impl: null,
            kind: null,
            _address: null
        }
    }

    /**
     * Public method to connect to a certain provider
     * Switch statement assigns the proper impl
     * @param kind one of WalletProvider.SUPPORTED_PROVIDERS
     * */
    async connect(kind) {
        switch (kind) {
            case  WalletProvider.SUPPORTED_PROVIDERS.WALLET_CONNECT :
                return await this._connectWithWalletConnect();
            case  WalletProvider.SUPPORTED_PROVIDERS.META_MASK :
                return await this._connectWithMetamask();
        }
    }

    /**
     * public method to disconnect wallet
     */
    async disconnect() {
        switch (this.selectecWalletProvider.kind) {
            case  WalletProvider.SUPPORTED_PROVIDERS.WALLET_CONNECT :
                await this._disconnectWalletConnnect();
                break;
            case  WalletProvider.SUPPORTED_PROVIDERS.META_MASK :
                await this._disconnectMetaMask();
                break;
        }
        this._setInitialState();
        console.log("successfully disconnected");

    }


    async _connectWithMetamask() {
        const [_address] = await window.ethereum.request({method: "eth_requestAccounts"})
        this.selectecWalletProvider = {
            impl: window.ethereum,
            kind: WalletProvider.SUPPORTED_PROVIDERS.META_MASK,
            _address: _address
        };
    }


    async _connectWithWalletConnect() {
        const walletConnectProvider = new WalletConnectProvider({
            infuraId: INFURA_ID
        });

        await walletConnectProvider.enable();
        const [_address] = walletConnectProvider.accounts;
        this.selectecWalletProvider = {
            impl: walletConnectProvider,
            kind: WalletProvider.SUPPORTED_PROVIDERS.WALLET_CONNECT,
            _address: _address
        };

    }

    async _disconnectWalletConnnect() {
        await this.selectecWalletProvider.impl.disconnect();
    }

    _disconnectMetaMask() {
        //Todo figure out how to disconnect from metamask
    }

}

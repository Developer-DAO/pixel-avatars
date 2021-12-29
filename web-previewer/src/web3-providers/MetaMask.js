export default class MetaMask {
    constructor() {
        this.provider = window.ethereum
    }

    async connect() {
        const [address] = await this.provider.request({
            method: 'eth_requestAccounts',
        })

        return address
    }

    async disconnect() {
        //
    }
}

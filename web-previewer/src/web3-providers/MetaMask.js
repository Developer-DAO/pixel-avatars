export default class MetaMask {
    constructor() {
        this.provider = window.ethereum
    }

    async connect() {
        return (
            (
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })
            )[0] ?? null
        )
    }

    async disconnect() {
        //
    }
}

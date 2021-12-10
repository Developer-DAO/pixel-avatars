export default class MetaMask {
    constructor() {
        this.provider = window.ethereum
    }

    async connect() {
        const [address] = await window.ethereum.request({
            method: 'eth_requestAccounts',
        })

        if (address) {
            // Reload on network change
            window.ethereum.on('chainChanged', (...args) => {
                window.location.reload()
            })
        }

        return address
    }

    async disconnect() {
        //
    }
}

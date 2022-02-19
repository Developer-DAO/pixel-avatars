<script>
import MetaMask from '../web3-providers/MetaMask'
import NetworkModal from './NetworkModal'
import WalletConnect from '../web3-providers/WalletConnect'
import { computed, onBeforeUnmount, provide, ref, watch } from 'vue'
import { ethers } from 'ethers'
import { PIXEL_AVATAR_NETWORK } from '../constants'

function useClient() {
    const connectedAddress = ref(null)
    const isConnected = computed(() => connectedAddress.value !== null)
    const networkFailure = ref(false)
    const latestProviderName = ref(null)
    const supportedProviders = Object.freeze({
        MetaMask: 'MetaMask',
        WalletConnect: 'WalletConnect',
    })

    const activeInstance = ref(null)
    const providers = {
        [supportedProviders.MetaMask]: new MetaMask(),
        [supportedProviders.WalletConnect]: new WalletConnect(),
    }

    return {
        connectedAddress,
        isConnected,
        networkFailure,
        latestProviderName,
        supportedProviders,

        async connect(providerName, triggerPrompt) {
            if (activeInstance.value) {
                await this.disconnect()
            }

            activeInstance.value = providers[providerName]
            latestProviderName.value = providerName
            networkFailure.value = false

            const address = await this._instance().connect(triggerPrompt)

            if (await this._checkCorrectNetwork()) {
                connectedAddress.value = address
            } else {
                networkFailure.value = true
            }

            return this
        },

        async retryConnect(triggerPrompt) {
            return this.connect(latestProviderName.value, triggerPrompt)
        },

        async changeNetwork() {
            try {
                await this._instance().changeNetwork()
            } catch (_error) {
                alert(
                    'Unfortunately this action is currently unsupported by your wallet. Please add network manually and check again.'
                )
            }
        },

        async disconnect() {
            await this._instance().disconnect()

            activeInstance.value = null
            connectedAddress.value = null
        },

        contract(token, contract) {
            const provider = this._provider()

            return new ethers.Contract(token, contract, provider.getSigner())
        },

        async _checkCorrectNetwork() {
            try {
                const network = await this._provider().getNetwork()

                return network.chainId === PIXEL_AVATAR_NETWORK.chainId
            } catch (e) {
                //
            }

            return false
        },

        _provider() {
            const { name, chainId, ensAddress } = PIXEL_AVATAR_NETWORK

            return new ethers.providers.Web3Provider(
                this._instance().provider,
                { name, chainId, ensAddress }
            )
        },

        _instance() {
            if (!activeInstance.value) {
                throw Error(
                    'No active web3 provider instance. Please connect first.'
                )
            }

            return activeInstance.value
        },
    }
}

function useAutoRetryConnectOnNetworkChange(client) {
    const retryConnectOnNetworkChange = () => {
        if (
            client.latestProviderName.value ===
            client.supportedProviders.MetaMask
        ) {
            client.retryConnect()
        }
    }

    // If connecting using MetaMask we will setup a listener to automatically
    // detect network changes and retry connecting. This is not currently
    // possible using WalletConnect.
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('chainChanged', retryConnectOnNetworkChange)

        onBeforeUnmount(() => {
            window.ethereum.removeListener(
                'chainChanged',
                retryConnectOnNetworkChange
            )
        })
    }
}

function useNetworkModalState(client) {
    const show = ref(false)

    watch(client.networkFailure, (failure) => (show.value = failure))

    return {
        show,

        close() {
            show.value = false
        },

        retry() {
            this.close()

            // Introduce slight delay to ensure the modal will close
            // and re-open in case network failure is still present.
            setTimeout(() => client.retryConnect(), 500)
        },
    }
}

export default {
    components: {
        NetworkModal,
    },

    setup() {
        const client = useClient()
        const networkModal = useNetworkModalState(client)
        useAutoRetryConnectOnNetworkChange(client)

        provide('web3client', client)

        return {
            client,
            networkModal,
        }
    },
}
</script>

<template>
    <div>
        <NetworkModal
            :show="networkModal.show.value"
            @changeNetwork="client.changeNetwork()"
            @close="networkModal.close()"
            @retry="networkModal.retry()"
        />

        <slot />
    </div>
</template>

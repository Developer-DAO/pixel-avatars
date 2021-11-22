<script setup>
import { inject } from 'vue'
import {SUPPORTED_PROVIDERS} from './useWeb3Provider';

const state = inject('walletState')
</script>

<template>
    <button
        v-if="!state.isConnected.value"
        class="bg-black text-white text-sm py-2 rounded px-4 inline-block"
        @click="state.connect(SUPPORTED_PROVIDERS.META_MASK)"
    >
        Connect Metamask
    </button>
    <button
        v-if="!state.isConnected.value"
        class="bg-black text-white text-sm py-2 rounded px-4 inline-block"
        @click="state.connect(SUPPORTED_PROVIDERS.WALLET_CONNECT)"
    >
        Connect with Wallet Connect
    </button>

    <div v-else class="flex-1 min-w-0 flex flex-col items-end space-y-1">
        <span class="text-sm text-gray-500">Connected to</span>
        <div>
            <span
                class="text-sm font-semibold truncate"
                v-text="state.address.value.substr(0, 20) + '...'"
            />
        </div>
        <button
            class="text-sm inline text-blue-500"
            @click="state.disconnect()"
        >
            Disconnect
        </button>
    </div>
</template>

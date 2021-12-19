<script setup>
import { computed, inject, ref, watch } from 'vue'
import Alert from './Alert'
import { OPEN_SEA_URL, CURRENCY_SYMBOL } from '../constants'
import { ethers } from 'ethers'

const previewState = inject('previewState')
const walletState = inject('walletState')

const CLAIMING_STATES = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
})

const claimToken = ref(null)
const claimState = ref(CLAIMING_STATES.IDLE)
const errorMessage = ref(null)
const mintPriceEther = ref(null)
const openSeaUrl = computed(
    () => `${OPEN_SEA_URL}/${walletState.address.value}`
)

async function loadMintPrice() {
    try {
        const price = await walletState.getMintPrice()

        mintPriceEther.value = ethers.utils.formatEther(price)
        errorMessage.value = null
    } catch (error) {
        errorMessage.value = error.message
    }
}

async function startClaiming() {
    try {
        claimState.value = CLAIMING_STATES.LOADING

        await walletState.claim(claimToken.value)

        claimState.value = CLAIMING_STATES.SUCCESS
        errorMessage.value = null
    } catch (error) {
        claimState.value = CLAIMING_STATES.ERROR
        errorMessage.value = error.message
    }
}

function updatePreview() {
    claimState.value = CLAIMING_STATES.IDLE
    errorMessage.value = null

    previewState.developer.value = claimToken.value
    previewState.updateTraits()
}

watch(previewState.developer, (developer) => {
    if (claimToken.value === developer) {
        return
    }

    if (
        walletState.tokens.value &&
        walletState.tokens.value.indexOf(developer) > -1
    ) {
        claimToken.value = developer
        return
    }

    claimToken.value = null
})

watch(walletState.isConnected, (isConnected) => {
    if (isConnected) {
        loadMintPrice()
    }
})
</script>

<template>
    <div v-if="walletState.isConnected.value">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
            Your personal avatars
        </h3>

        <p class="mt-2 text-gray-600 text-sm">
            Here is a list of genesis tokens owned by your connected account.
            <br />
            Please select the token number you wish to claim.
        </p>

        <Alert
            v-if="claimState === CLAIMING_STATES.SUCCESS"
            class="mt-3 space-y-2"
            type="success"
        >
            <p><b>Congratulations!</b> 🎉🚀.</p>
            <p>You are now the official owner of avatar #{{ claimToken }}.</p>
            <p>
                <a :href="openSeaUrl" target="_blank" class="text-blue-600">
                    Check out your account on OpenSea ↗
                </a>
            </p>
        </Alert>

        <Alert v-if="errorMessage" class="mt-3" style="overflow-wrap: anywhere">
            Error: {{ errorMessage }}
        </Alert>

        <template v-if="walletState.tokens.value !== null">
            <div v-if="walletState.tokens.value.length > 0">
                <div class="mt-3 relative">
                    <select
                        v-model="claimToken"
                        dir="rtl"
                        class="input-select !pr-12"
                        @change="updatePreview"
                    >
                        <option :value="null" />
                        <option
                            v-for="token in walletState.tokens.value"
                            :key="token"
                            :value="token"
                            v-text="token"
                        />
                    </select>
                    <div
                        class="
                            absolute
                            left-0
                            top-0
                            bottom-1
                            flex
                            items-center
                            text-sm text-gray-600
                        "
                    >
                        <span>Your personal tokens</span>
                    </div>
                </div>

                <div v-if="mintPriceEther" class="mt-4 flex justify-between">
                    <span class="text-sm text-gray-600">Mint price</span>
                    <span>{{ mintPriceEther }} {{ CURRENCY_SYMBOL }}</span>
                </div>
            </div>
            <Alert v-else>
                No genesis tokens are available on this address. You must own a
                genesis token before you can claim an avatar.
            </Alert>
        </template>

        <div class="mt-5 text-right">
            <button
                v-if="claimToken"
                class="
                    bg-black
                    text-white
                    rounded
                    text-sm
                    py-3
                    px-4
                    w-full
                    max-w-[12rem]
                    disabled:bg-opacity-70
                "
                :disabled="
                    [CLAIMING_STATES.LOADING, CLAIMING_STATES.SUCCESS].indexOf(
                        claimState
                    ) > -1
                "
                @click="startClaiming()"
            >
                <span v-if="claimState === CLAIMING_STATES.LOADING">
                    Claiming...
                </span>
                <span v-else>Claim avatar</span>
            </button>
        </div>
    </div>
</template>

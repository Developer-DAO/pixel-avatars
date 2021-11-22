<script setup>
import { computed, inject, ref, watch } from 'vue'
import Alert from './Alert'
import { NETWORK } from '../constants/adresses'

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
const claimError = ref(null)

const openSeaUrl = computed(() => {
    const base =
        NETWORK === 'rinkeby'
            ? 'https://testnets.opensea.io'
            : 'https://opensea.io'

    return `${base}/${walletState.address.value}`
})

function updatePreview() {
    previewState.developer.value = claimToken.value
    previewState.updateTraits()
}

async function startClaiming() {
    try {
        claimState.value = CLAIMING_STATES.LOADING

        await walletState.claim(claimToken.value)

        claimState.value = CLAIMING_STATES.SUCCESS
        claimError.value = null
    } catch (error) {
        claimState.value = CLAIMING_STATES.ERROR

        claimError.value = null
            ?? error?.error?.data?.originalError
            ?? error?.error
            ?? error
    }
}

watch(previewState.developer, (developer) => {
    if (claimToken.value === developer) {
        return
    }

    if (walletState.tokens.value.indexOf(developer) > -1) {
        claimToken.value = developer
        return
    }

    claimToken.value = null
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
                <a :href="openSeaUrl" target="_blank" class="text-blue-600"
                    >Check out your account on OpenSea ↗</a
                >
            </p>
        </Alert>

        <Alert v-if="claimError" class="mt-3">
            Error: {{ claimError.message }}
        </Alert>

        <template v-if="walletState.tokens.value !== null">
            <div
                v-if="walletState.tokens.value.length > 0"
                class="mt-3 relative"
            >
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

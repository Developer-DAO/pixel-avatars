<script setup>
import Alert from '../../components/ui/Alert.vue'
import useAvatarContract from './useAvatarContract'
import { computed, inject, ref, watch } from 'vue'
import {
    OPEN_SEA_URL,
    PIXEL_AVATAR_NETWORK,
    TEST_MINT_GENESIS_URL,
} from '../../constants'

const CLAIMING_STATES = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
})

const client = inject('web3client')
const previewState = inject('previewState')
const avatarContract = useAvatarContract()

const availableTokens = ref(null)
const claimToken = ref(null)
const claimState = ref(CLAIMING_STATES.IDLE)
const errorMessage = ref(null)
const mintPriceEther = ref(null)
const openSeaUrl = computed(
    () => `${OPEN_SEA_URL}/${client.connectedAddress.value}`
)

async function startClaiming() {
    try {
        claimState.value = CLAIMING_STATES.LOADING

        await avatarContract.claim(claimToken.value)

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

// Automatically set claimToken based on previewState
watch(previewState.developer, (developer) => {
    if (claimToken.value === developer) {
        return
    }

    if (
        availableTokens.value &&
        availableTokens.value.indexOf(developer) > -1
    ) {
        claimToken.value = developer
        return
    }

    claimToken.value = null
})

// Load available tokens + mint price when connected to wallet
watch(client.isConnected, async (isConnected) => {
    if (isConnected) {
        availableTokens.value = await avatarContract.getAvailableTokens()
        mintPriceEther.value = await avatarContract.getMintPriceInEther()
    }
})
</script>

<template>
    <div v-if="client.isConnected.value">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
            Your personal avatars
        </h3>

        <p class="mt-2 text-gray-600 text-sm">
            Here is a list of genesis tokens owned by your connected account.
            <br />
            Please select the token number you wish to claim.
        </p>

        <Alert v-if="TEST_MINT_GENESIS_URL" color="yellow">
            <div class="space-y-2">
                <p><b>TEST MODE</b></p>
                <p>
                    Before you can claim any Pixel Avatars you must first make
                    sure your currently connected address holds genesis tokens
                    from the test contract.
                </p>
                <p>
                    During test mode you may mint genesis tokens for free to
                    test out the claim flow.
                </p>
                <p>
                    <a
                        :href="TEST_MINT_GENESIS_URL"
                        target="_blank"
                        class="text-blue-600"
                        >Mint genesis tokens here ↗</a
                    >
                </p>
            </div>
        </Alert>

        <Alert
            v-if="claimState === CLAIMING_STATES.SUCCESS"
            class="mt-3 space-y-2"
            color="green"
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

        <template v-if="availableTokens !== null">
            <div v-if="availableTokens.length > 0">
                <div class="mt-3 relative">
                    <select
                        v-model="claimToken"
                        dir="rtl"
                        class="input-select !pr-12"
                        @change="updatePreview"
                    >
                        <option :value="null" />
                        <option
                            v-for="token in availableTokens"
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
                    <span>
                        {{ mintPriceEther }}
                        {{ PIXEL_AVATAR_NETWORK.currencySymbol }}
                    </span>
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

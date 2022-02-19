<script setup>
import Alert from '../../components/ui/Alert.vue'
import InsufficientFundsModal from '../../components/InsufficientFundsModal'
import EmptyInventoryModal from '../../components/EmptyInventoryModal'
import ShareModal from '../../components/ShareModal'
import useAvatarContract from './useAvatarContract'
import { computed, inject, ref, watch, watchEffect } from 'vue'
import { PIXEL_AVATAR_NETWORK, TEST_MINT_GENESIS_URL } from '../../constants'
import { CheckIcon } from '@heroicons/vue/outline'

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
const claimState = ref(CLAIMING_STATES.IDLE)
const claimToken = ref(null)
const claimTokenIsMinted = computed(() => {
    return findTokenInInventory(claimToken.value)?.minted === true
})
const claimButtonDisabled = computed(() => {
    return (
        claimTokenIsMinted.value ||
        [CLAIMING_STATES.LOADING, CLAIMING_STATES.SUCCESS].indexOf(
            claimState.value
        ) > -1
    )
})
const errorMessage = ref(null)
const mintPriceEther = ref(null)
const showModal = ref(null)

async function startClaiming() {
    try {
        claimState.value = CLAIMING_STATES.LOADING

        await avatarContract.claim(claimToken.value)

        claimState.value = CLAIMING_STATES.SUCCESS
        errorMessage.value = null
        showModal.value = null

        // Refresh available tokens
        availableTokens.value = await avatarContract.getAvailableTokens()

        // Refresh owner status in preview
        previewState.updateDeveloper()

        // Show share modal
        showModal.value = 'share'
    } catch (error) {
        claimState.value = CLAIMING_STATES.ERROR
        errorMessage.value = error.message

        if (errorMessage.value.includes('insufficient funds')) {
            errorMessage.value = 'Insufficient funds in wallet.'
            showModal.value = 'insufficient_funds'
        }
    }
}

function closeModal() {
    showModal.value = null
}

function findTokenInInventory(token) {
    return (availableTokens.value ?? []).find(
        (obj) => parseInt(obj.token) === parseInt(token)
    )
}

function updatePreview() {
    claimState.value = CLAIMING_STATES.IDLE
    errorMessage.value = null

    previewState.developer.value = claimToken.value
    previewState.updateTraits()
}

// Automatically set claimToken based on previewState
watch(previewState.developer, (developer) => {
    const token = parseInt(developer)

    if (token === parseInt(claimToken.value) && !isNaN(token)) {
        return
    }

    if (findTokenInInventory(token)) {
        return (claimToken.value = token)
    }

    claimToken.value = null
})

// Load available tokens + mint price when connected to wallet
watch(client.isConnected, async (isConnected) => {
    if (isConnected) {
        claimState.value = CLAIMING_STATES.IDLE
        claimToken.value = null
        errorMessage.value = null
        availableTokens.value = await avatarContract.getAvailableTokens()
        mintPriceEther.value = await avatarContract.getMintPriceInEther()

        if (availableTokens.value.length === 0) {
            showModal.value = 'empty_inventory'
        } else {
            claimToken.value = findTokenInInventory(
                previewState.developer.value
            )
                ? previewState.developer.value
                : availableTokens.value[0].token

            updatePreview()
        }
    }
})
</script>

<template>
    <div v-if="client.isConnected.value">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
            Your Pixel Devs
        </h3>

        <p class="mt-2 text-gray-600 text-sm">
            Here is a list of genesis tokens owned by your connected account.
            <br />
            Please select the token number for which you wish to claim your
            Pixel Dev.
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
                    >Mint genesis tokens here ↗</a>
                </p>
            </div>
        </Alert>

        <Alert
            v-if="claimTokenIsMinted"
            class="mt-3 flex items-center space-x-1"
            color="green"
        >
            <span>Successfully minted</span>
            <CheckIcon class="w-4 h-4" />
        </Alert>

        <Alert v-if="errorMessage" class="mt-3" style="overflow-wrap: anywhere">
            Error: {{ errorMessage }}
        </Alert>

        <Alert
            v-if="availableTokens !== null && availableTokens.length === 0"
            class="mt-3"
        >
            No genesis tokens are available on this address. You must own a
            genesis token before you can claim an avatar.
        </Alert>

        <div class="mt-3 relative">
            <select
                v-model="claimToken"
                dir="rtl"
                class="input-select !pr-12"
                :disabled="availableTokens === null"
                @change="updatePreview"
            >
                <option
                    :value="null"
                    v-text="availableTokens === null ? 'Loading' : ''"
                />
                <option
                    v-for="{ token, minted } in availableTokens ?? []"
                    :key="token"
                    :value="token"
                    v-text="token + (minted ? ' - Minted' : '')"
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
                <span>Available tokens</span>
            </div>
        </div>

        <div class="mt-4 flex justify-between">
            <span class="text-sm text-gray-600">Mint price</span>
            <span class="flex items-center space-x-1">
                <span v-if="mintPriceEther" v-text="mintPriceEther" />
                <span v-else class="h-1 w-40 bg-blue-100 rounded-lg" />
                <span v-text="PIXEL_AVATAR_NETWORK.currencySymbol" />
            </span>
        </div>

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
                    disabled:bg-opacity-60 disabled:cursor-not-allowed
                "
                :disabled="claimButtonDisabled"
                @click="startClaiming()"
            >
                <span v-if="claimState === CLAIMING_STATES.LOADING">
                    Claiming...
                </span>
                <span v-else>Claim avatar</span>
            </button>
        </div>

        <EmptyInventoryModal
            :show="showModal === 'empty_inventory'"
            @switchAccount="closeModal() || client.retryConnect(true)"
            @disconnect="closeModal() || client.disconnect()"
            @close="closeModal()"
        />

        <InsufficientFundsModal
            :show="showModal === 'insufficient_funds'"
            @close="closeModal()"
        />

        <ShareModal
            v-if="claimToken"
            :show="showModal === 'share'"
            :token="claimToken"
            @close="closeModal()"
        />
    </div>
</template>

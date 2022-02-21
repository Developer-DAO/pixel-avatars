<script setup>
import { computed, inject, ref, watchEffect } from 'vue'
import { ExternalLinkIcon, ShareIcon } from '@heroicons/vue/outline'
import { OPEN_SEA_URL } from '../../constants'
import useAvatarContract from './useAvatarContract'
import Address from '../../components/ui/Address'
import ShareModal from '../../components/ShareModal'
import Button from '../../components/ui/Button'
import { useLaunchCounter } from '../../components/LaunchBanner'

const avatarContract = useAvatarContract()
const client = inject('web3client')
const state = inject('previewState')
const showModal = ref(false)
const owner = ref(null)
const ownerLink = computed(() =>
    owner.value ? `${OPEN_SEA_URL}/${owner.value}` : null
)
const ownedByUser = computed(
    () =>
        (owner.value ?? '').toLowerCase() ===
        (client.connectedAddress.value ?? '').toLowerCase()
)
const launchCounter = useLaunchCounter()

watchEffect(async () => {
    const token = state.developer.value

    if (client.isConnected.value) {
        owner.value = await avatarContract.getOwnerOf(token)
    }
})
</script>

<template>
    <div class="space-y-4">
        <svg viewBox="0 0 500 510" class="rounded-md">
            <g
                v-for="layer in state.layers.value"
                :key="layer"
                transform="translate(-47, -92) scale(1.20)"
            >
                <image :href="layer" class="w-full" />
            </g>
        </svg>

        <div class="text-gray-500 dark:text-gray-400 text-sm">
            <span v-if="client.isConnected.value">
                <span v-if="owner" class="flex justify-between">
                    <span>
                        <span>Owned by </span>
                        <a
                            class="
                                text-blue-600
                                dark:text-blue-400
                                inline-flex
                                space-x-1
                            "
                            :href="ownerLink"
                            target="_blank"
                        >
                            <span v-if="ownedByUser">You</span>
                            <Address v-else v-model="owner" />
                            <ExternalLinkIcon class="h-4 w-4 text-blue-400" />
                        </a>
                    </span>
                    <span>
                        <button
                            class="flex items-center space-x-1"
                            @click="showModal = true"
                        >
                            <span>Share</span>
                            <ShareIcon class="h-4 w-4" />
                        </button>
                    </span>
                </span>
                <span v-else> Unclaimed </span>
            </span>
            <span v-else>
                <span> NFT Preview. </span>
                <span v-if="launchCounter.launched.value">
                    Connect wallet to check owner status and mint.
                </span>
            </span>
        </div>

        <ShareModal
            v-if="client.isConnected.value"
            :token="state.developer.value"
            :show="showModal"
            @close="showModal = false"
        />
    </div>
</template>

<script setup>
import { computed, inject, ref, watchEffect } from 'vue'
import { ExternalLinkIcon } from '@heroicons/vue/outline'
import { OPEN_SEA_URL } from '../../constants'
import useAvatarContract from './useAvatarContract'
import Address from '../../components/ui/Address'

const avatarContract = useAvatarContract()
const client = inject('web3client')
const state = inject('previewState')
const owner = ref(null)
const ownerLink = computed(() =>
    owner.value ? `${OPEN_SEA_URL}/${owner.value}` : null
)
const ownedByUser = computed(
    () =>
        (owner.value ?? '').toLowerCase() ===
        (client.connectedAddress.value ?? '').toLowerCase()
)

watchEffect(async () => {
    const token = state.developer.value

    if (client.isConnected.value) {
        owner.value = await avatarContract.getOwnerOf(token)
    }
})
</script>

<template>
    <div class="p-4 space-y-4">
        <svg viewBox="0 0 500 510">
            <g
                v-for="layer in state.layers.value"
                :key="layer"
                transform="translate(-47, -92) scale(1.20)"
            >
                <image :href="layer" class="w-full" />
            </g>
        </svg>

        <div class="text-gray-500 text-sm">
            <span v-if="client.isConnected.value">
                <span v-if="owner">
                    <span>Owned by </span>
                    <a
                        class="text-blue-600 inline-flex space-x-1"
                        :href="ownerLink"
                        target="_blank"
                    >
                        <span v-if="ownedByUser">You</span>
                        <Address v-else v-model="owner" />
                        <ExternalLinkIcon class="h-4 w-4 text-blue-400" />
                    </a>
                </span>
                <span v-else> Available for mint </span>
            </span>
            <span v-else> Connect wallet to check owner status </span>
        </div>
    </div>
</template>

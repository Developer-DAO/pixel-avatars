<script setup>
import Button from './ui/Button'
import Modal from './ui/Modal'
import { PIXEL_AVATAR_NETWORK } from '../constants'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import { WifiIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
import { defineProps, defineEmits } from 'vue'

defineProps({ show: Boolean })
defineEmits(['changeNetwork', 'close', 'retry'])
</script>

<template>
    <Modal :show="show" @close="$emit('close')">
        <div>
            <div
                class="
                    mx-auto
                    flex
                    items-center
                    justify-center
                    h-12
                    w-12
                    rounded-full
                    bg-purple-100
                    text-purple-600
                    dark:bg-purple-500 dark:text-purple-100
                "
            >
                <WifiIcon class="h-6 w-6" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                    as="h3"
                    class="
                        text-lg
                        leading-6
                        font-medium
                        text-gray-900
                        dark:text-gray-100
                    "
                >
                    Network: {{ PIXEL_AVATAR_NETWORK.name }}
                </DialogTitle>
                <DialogDescription class="mt-3">
                    <p class="text-sm text-gray-500 dark:text-gray-300">
                        Please ensure your wallet is connected to the following
                        network and try again.
                    </p>
                </DialogDescription>
                <dl
                    class="
                        mt-6
                        grid grid-cols-2
                        gap-y-4
                        text-sm text-left
                        dark:text-gray-300
                    "
                >
                    <dt class="font-medium">Network name</dt>
                    <dd class="break-all">{{ PIXEL_AVATAR_NETWORK.name }}</dd>

                    <dt class="font-medium">Chain ID</dt>
                    <dd class="break-all">
                        {{ PIXEL_AVATAR_NETWORK.chainId }}
                    </dd>

                    <dt class="font-medium">RPC URL</dt>
                    <dd class="break-all">
                        {{ PIXEL_AVATAR_NETWORK.ensAddress }}
                    </dd>

                    <dt class="font-medium">Currency Symbol</dt>
                    <dd class="break-all">
                        {{ PIXEL_AVATAR_NETWORK.currencySymbol }}
                    </dd>

                    <dt class="font-medium">Block Explorer</dt>
                    <dd class="break-all">
                        {{ PIXEL_AVATAR_NETWORK.blockExplorer }}
                    </dd>
                </dl>
            </div>
        </div>

        <div class="mt-5 text-sm text-gray-500 dark:text-gray-400">
            For more information:
            <a
                href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC"
                class="
                    text-blue-600
                    dark:text-blue-400
                    flex
                    items-center
                    space-x-1
                "
                target="_blank"
            >
                <span>How to add a custom network to MetaMask</span>
                <ExternalLinkIcon class="h-4 w-4 text-gray-400" />
            </a>
        </div>

        <div class="mt-5 sm:mt-6 space-y-2">
            <Button type="button" @click="$emit('changeNetwork')">
                Change network
            </Button>
            <Button type="button" color="blackOutline" @click="$emit('retry')">
                Reconnect
            </Button>
            <Button type="button" color="blackOutline" @click="$emit('close')">
                Cancel
            </Button>
        </div>
    </Modal>
</template>

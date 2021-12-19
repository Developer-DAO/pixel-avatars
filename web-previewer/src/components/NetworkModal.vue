<script setup>
import Button from './ui/Button'
import Modal from './ui/Modal'
import { PIXEL_AVATAR_NETWORK } from '../constants'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import { ExclamationIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
import { defineProps, defineEmits } from 'vue'

defineProps({ show: Boolean })
defineEmits(['close', 'retry'])
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
                    bg-red-100
                "
            >
                <ExclamationIcon
                    class="h-6 w-6 text-red-600"
                    aria-hidden="true"
                />
            </div>
            <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                    as="h3"
                    class="text-lg leading-6 font-medium text-gray-900"
                >
                    Network error
                </DialogTitle>
                <DialogDescription class="mt-2">
                    <p class="text-sm text-gray-500">
                        Please ensure your wallet is connected to the following
                        network and try again.
                    </p>
                </DialogDescription>
                <dl class="mt-5 grid grid-cols-2 gap-y-4 text-sm text-left">
                    <dt class="font-medium">Network name</dt>
                    <dd>{{ PIXEL_AVATAR_NETWORK.name }}</dd>

                    <dt class="font-medium">Chain ID</dt>
                    <dd>{{ PIXEL_AVATAR_NETWORK.chainId }}</dd>

                    <dt class="font-medium">RPC URL</dt>
                    <dd>{{ PIXEL_AVATAR_NETWORK.ensAddress }}</dd>
                </dl>
            </div>
        </div>

        <div class="mt-5 text-sm text-gray-500">
            For more information:
            <a
                href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC"
                class="text-blue-600 flex items-center space-x-1"
                target="_blank"
            >
                <span>How to add a custom network to MetaMask</span>
                <ExternalLinkIcon class="h-4 w-4 text-gray-400" />
            </a>
        </div>

        <div class="mt-5 sm:mt-6 space-y-2">
            <Button type="button" @click="$emit('retry')"> Try again </Button>
            <Button type="button" color="blackOutline" @click="$emit('close')">
                Cancel
            </Button>
        </div>
    </Modal>
</template>

<script setup>
import Button from './ui/Button'
import Modal from './ui/Modal'
import { PIXEL_AVATAR_NETWORK } from '../constants'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import { ExclamationIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
import { defineProps, defineEmits } from 'vue'

defineProps({ show: Boolean })
defineEmits(['close'])
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
                    Insufficient funds in wallet
                </DialogTitle>
                <DialogDescription class="mt-2 text-sm text-gray-500">
                    <p>
                        Unfortunately your wallet does not hold enough
                        <b>{{ PIXEL_AVATAR_NETWORK.currencySymbol }}</b> to
                        complete this transaction.
                    </p>
                </DialogDescription>
            </div>
        </div>

        <div class="mt-5 text-sm text-gray-500">
            Don't worry though! Here are some resources that might help get you
            started:

            <ul class="mt-4 ml-4 space-y-2 list-disc">
                <li>
                    <a
                        href="https://github.com/Developer-DAO/pixel-avatars/issues/83"
                        class="text-blue-600 flex items-center space-x-1"
                        target="_blank"
                    >
                        <span>How to purchase
                            {{ PIXEL_AVATAR_NETWORK.currencySymbol }} from FIAT
                            with low fees</span>
                        <ExternalLinkIcon class="h-4 w-4 text-gray-400" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://app.uniswap.org/#/swap?chain=mainnet"
                        class="text-blue-600 flex items-center space-x-1"
                        target="_blank"
                    >
                        <span>Convert other crypto to
                            {{ PIXEL_AVATAR_NETWORK.currencySymbol }}</span>
                        <ExternalLinkIcon class="h-4 w-4 text-gray-400" />
                    </a>
                </li>
            </ul>
        </div>

        <div class="mt-5 sm:mt-6 space-y-2">
            <Button type="button" @click="$emit('close')"> Close </Button>
        </div>
    </Modal>
</template>

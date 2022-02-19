<script setup>
import Button from './ui/Button'
import Modal from './ui/Modal'
import { PIXEL_AVATAR_NETWORK } from '../constants'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import { ExclamationIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
import { defineProps, defineEmits } from 'vue'

defineProps({ show: Boolean })
defineEmits(['switchAccount', 'disconnect', 'close'])
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
                    text-red-600
                    dark:bg-red-500 dark:text-white
                "
            >
                <ExclamationIcon class="h-6 w-6" aria-hidden="true" />
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
                    No available Genesis NFT
                </DialogTitle>
                <DialogDescription
                    class="mt-3 text-sm text-gray-500 dark:text-gray-300"
                >
                    <p>
                        It appears the account you have connected does not hold
                        any Developer Dao Genesis NFT.
                    </p>
                </DialogDescription>
            </div>
        </div>

        <div
            class="
                my-5
                border-t border-gray-200
                dark:border-gray-400
                w-32
                mx-auto
            "
        />

        <div class="text-sm text-gray-500 dark:text-gray-300 space-y-4">
            <p>
                Only Developer DAO members currently holding a Genesis NFT are
                eligible to mint the corresponding Pixel Dev.
            </p>

            <p>
                If you are a Developer DAO member seeing this message please
                check that you have connected with the same account that holds
                your Genesis NFT on Ethereum.
            </p>
        </div>

        <div class="mt-5 sm:mt-6 space-y-2">
            <Button type="button" @click="$emit('switchAccount')">
                Switch account
            </Button>
            <Button
                type="button"
                color="blackOutline"
                @click="$emit('disconnect')"
            >
                Disconnect
            </Button>
            <Button type="button" color="blackOutline" @click="$emit('close')">
                Dismiss
            </Button>
        </div>
    </Modal>
</template>

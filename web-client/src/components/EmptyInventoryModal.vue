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
                    Whoops. No available Genesis NFT
                </DialogTitle>
                <DialogDescription class="mt-2 text-sm text-gray-500">
                    <p>
                        It appears the account you have connected with does hold
                        any Developer Dao Genesis NFT.
                    </p>
                </DialogDescription>
            </div>
        </div>

        <div class="mt-5 text-sm text-gray-500 space-y-4">
            <p>
                Only Developer DAO members currently holding a Genesis NFT are
                eligible to mint the corresponding Pixel Dev.
            </p>

            <p>
                If you are a Developer DAO member seeing this error message
                please check that you have connected with the correct account.
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

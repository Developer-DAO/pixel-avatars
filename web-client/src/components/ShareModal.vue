<script setup>
import axios from 'axios'
import Button from './ui/Button'
import Modal from './ui/Modal'
import useAvatarContract from '../pages/Home/useAvatarContract'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import { CheckIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
import { OPEN_SEA_URL } from '../constants'
import {
    defineProps,
    defineEmits,
    computed,
    ref,
    watchEffect,
    inject,
} from 'vue'

defineEmits(['close'])

const props = defineProps({ show: Boolean, token: null })
const client = inject('web3client')
const avatarContract = useAvatarContract()
const image = ref(null)
const openSeaUrl = computed(
    () => `${OPEN_SEA_URL}/${client.connectedAddress.value}`
)

function cdnUrl(ipfs) {
    return 'https://cloudflare-ipfs.com/ipfs/' + ipfs.replace('ipfs://', '')
}

watchEffect(async () => {
    if (props.token && props.show) {
        const ipfs = await avatarContract.getTokenUri(props.token)

        if (ipfs) {
            const meta = await axios.get(cdnUrl(ipfs))

            image.value = cdnUrl(meta.data.image)

            return
        }
    }

    image.value = null
})
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
                    bg-green-100
                "
            >
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                    as="h3"
                    class="text-lg leading-6 font-medium text-gray-900"
                >
                    Congratulations! 🎉🚀
                </DialogTitle>
                <DialogDescription class="mt-2 text-sm text-gray-500">
                    <p>
                        You are the owner of <b>Pixel Dev #{{ token }}</b>. Here is the full JPEG ready to share on social media.
                    </p>
                </DialogDescription>

                <div
                    class="
                        mt-4
                        bg-blue-100
                        rounded-md
                        min-h-[16rem]
                        md:min-h-[20rem]
                    "
                >
                    <img v-if="image" :src="image" class="w-full rounded-md" />
                </div>
            </div>
        </div>

        <div class="mt-5 sm:mt-6 space-y-2">
            <Button type="button" @click="$emit('close')">
                <span>Close</span>
            </Button>
            <Button
                as="a"
                :href="openSeaUrl"
                target="_blank"
                color="blackOutline"
                class="flex justify-center items-center space-x-2"
                @click="$emit('close')"
            >
                <span>OpenSea Account</span>
                <ExternalLinkIcon class="h-4 w-4 text-gray-400" />
            </Button>
        </div>
    </Modal>
</template>

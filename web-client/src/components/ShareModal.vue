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
import Spinner from "./ui/Spinner";
import JSConfetti from "js-confetti";

defineEmits(['close'])

const props = defineProps({
    show: Boolean,
    token: null,
    confetti: {
        type: Boolean,
        default: false
    }
})

const client = inject('web3client')
const avatarContract = useAvatarContract()
const image = ref(null)
const openSeaUrl = computed(
    () => `${OPEN_SEA_URL}/${client.connectedAddress.value}`
)

function ipfsCdnUrl(base, ipfs) {
    return base + ipfs.replace('ipfs://', '')
}

async function getIpfs(ipfsUrl, method = 'get') {
    return await Promise.race([
        axios[method](ipfsCdnUrl('https://cloudflare-ipfs.com/ipfs/', ipfsUrl)),
        axios[method](ipfsCdnUrl('https://ipfs.io/ipfs/', ipfsUrl)),
    ])
}

async function getImageUrl(token) {
    const ipfsMetaUrl = await avatarContract.getTokenUri(token)

    if (ipfsMetaUrl) {
        const meta = await getIpfs(ipfsMetaUrl)

        // We'll send a HEAD request to two CDNs and see who replies first.
        // Once the first replies we'll know that they have cached the image
        // and we'll use that CDN to display the NFT in the HTML image tag.
        const imageResponse = await getIpfs(meta.data.image, 'head')

        return imageResponse.request.responseURL
    }

    return null
}

const confetti = props.confetti
    ? new JSConfetti()
    : null

watchEffect(async () => {
    image.value = props.token && props.show
        ? await getImageUrl(props.token)
        : null

    if (image.value && typeof confetti !== 'undefined') {
        setTimeout(() => confetti.addConfetti(), 500)
    }
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
                    text-green-600
                    dark:bg-green-500 dark:text-green-100
                "
            >
                <CheckIcon class="h-6 w-6" aria-hidden="true" />
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
                    Congratulations! 🎉
                </DialogTitle>
                <DialogDescription
                    class="mt-3 text-sm text-gray-500 dark:text-gray-300"
                >
                    <p>
                        You are the owner of <b>Pixel Dev #{{ token }}</b>. Here is the full JPEG ready to share on social media.
                    </p>
                </DialogDescription>
                <div
                    class="
                        mt-5
                        bg-blue-100
                        rounded-md
                        min-h-[16rem]
                        md:min-h-[20rem]
                        flex
                        items-center
                        justify-center
                    "
                >
                    <img v-if="image" :src="image" class="w-full rounded-md" />
                    <Spinner v-else class="h-6 w-6 text-blue-800" />
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
            >
                <span>OpenSea Account</span>
                <ExternalLinkIcon
                    class="h-4 w-4 text-gray-400 dark:text-gray-300"
                />
            </Button>
        </div>
    </Modal>
</template>

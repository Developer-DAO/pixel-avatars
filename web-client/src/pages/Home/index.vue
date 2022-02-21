<script setup>
import ClaimControls from './ClaimControls.vue'
import ConnectWallet from './ConnectWallet.vue'
import DaoLogo from '../../components/ui/DaoLogo.vue'
import Preview from './Preview.vue'
import PreviewControls from './PreviewControls.vue'
import usePreviewState from './usePreviewState'
import useRouteParameterSync from './useRouteParameterSync'
import { computed, provide } from 'vue'
import { PIXEL_AVATAR_NETWORK } from '../../constants'
import {
    default as LaunchBanner,
    useLaunchCounter,
} from '../../components/LaunchBanner'
import Faq from "./Faq";
import Footer from "./Footer";

const networkConfigured = PIXEL_AVATAR_NETWORK.chainId > 0
const previewState = usePreviewState()
const launchCounter = useLaunchCounter()
const showConnectButton = computed(
    () => networkConfigured && launchCounter.launched.value
)

useRouteParameterSync(previewState)

provide('previewState', previewState)
</script>

<template>
    <div class="text-gray-800 dark:text-gray-200">
        <div class="min-h-screen flex flex-col">
            <LaunchBanner />

            <div class="flex-1 flex flex-col sm:flex-row">
                <section
                    class="
                        sm:w-2/5
                        bg-white
                        dark:bg-gray-900
                        py-6
                        sm:py-10
                        px-4
                        md:px-6
                        flex
                    "
                >
                    <div
                        class="
                            flex flex-col
                            items-center
                            justify-center
                            space-y-10
                            w-full
                            max-w-md
                            mx-auto
                        "
                    >
                        <div
                            class="flex items-center w-full"
                            :class="
                                showConnectButton
                                    ? 'justify-between'
                                    : 'justify-around'
                            "
                        >
                            <DaoLogo class="w-16 h-16 rounded-full shadow-md" />

                            <ConnectWallet v-if="showConnectButton" />
                        </div>

                        <ClaimControls />

                        <PreviewControls />
                    </div>
                </section>

                <section
                    class="
                        sm:w-3/5
                        bg-gray-100
                        dark:bg-gray-950
                        border-l border-gray-200
                        dark:border-gray-800
                    "
                >
                    <div class="flex flex-col sm:h-full sm:sticky sm:top-0">
                        <div
                            class="
                                sm:-mb-12
                                flex-1 flex
                                items-center
                                justify-center
                            "
                        >
                            <Preview class="flex-1 max-w-md px-4 py-6 sm:py-10" />
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <Faq />

        <Footer />
    </div>
</template>

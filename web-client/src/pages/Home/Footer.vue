<script setup>
import { ExternalLinkIcon } from '@heroicons/vue/outline'
</script>

<template>
    <section
        class="border-t-8 border-gray-200 dark:border-gray-700 dark:bg-gray-900"
    >
        <div
            class="
                max-2xl
                mx-auto
                py-8
                px-4
                sm:px-6
                lg:max-w-7xl lg:px-8
                flex
                justify-end
                items-center
                space-x-8
            "
        >
            <a
                href="https://opensea.io/collection/pixel-devs"
                class="flex items-center space-x-2"
                target="_blank"
            >
                <span>Open Sea</span>
                <ExternalLinkIcon class="inline-block h-4 w-4" />
            </a>

            <a
                href="https://github.com/Developer-DAO/pixel-avatars"
                class="flex items-center space-x-2"
                target="_blank"
            >
                <span>Github</span>
                <ExternalLinkIcon class="inline-block h-4 w-4" />
            </a>

            <a
                href="https://twitter.com/developer_dao"
                class="flex items-center space-x-2"
                target="_blank"
            >
                <span>Twitter</span>
                <ExternalLinkIcon class="inline-block h-4 w-4" />
            </a>
        </div>
    </section>
</template>

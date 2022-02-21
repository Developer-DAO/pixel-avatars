<script setup>
import { ExternalLinkIcon } from '@heroicons/vue/outline'

const faqs = [
    {
        question: 'What are Pixel Devs?',
        answer: 'They are a derivative NFT on the Polygon Network based on the Genesis Developer DAO NFT: Developers for Revolution. They are a graphical representation of the text-based properties from the Genesis NFT.',
    },
    {
        question: 'Do I become Developer DAO member by purchasing a Pixel Dev?',
        answer: 'No, a Pixel Dev is a Derivative NFT and requires you are already a DAO member. Please follow Developer DAO to stay tuned for further openings.',
    },
    {
        question: 'How do i get a Pixel Dev?',
        answer: 'You need to hold a Genesis NFT to be able to mint a Pixel Dev. You can claim your Pixel Dev on this website by logging in with your wallet after launch. Please note you must login with the same address that holds your Genesis NFT.',
    },
    {
        question: 'What network do we use?',
        answer: 'Pixel Devs are minted on the Polygon Network. Polygon provides lower gas fees making the NFTs more accessible and affordable for our members.',
    },
    {
        question: 'How do i get MATIC on Polygon?',
        answer: "Check out <a href='https://github.com/Developer-DAO/pixel-avatars/wiki/Polygon-MATIC' target='_blank' class='underline'>this guide</a> on the different ways you may acquire MATIC.",
    },
    {
        question: 'How much does a Pixel Dev cost?',
        answer: 'Each Pixel Dev costs 12 MATIC to mint.',
    },
]
</script>

<template>
    <section
        aria-labelledby="faq"
        class="
            border-t-8
            bg-gray-50
            border-gray-200
            dark:border-gray-700 dark:bg-black
        "
    >
        <div
            class="
                max-2xl
                mx-auto
                py-16
                px-4
                sm:py-20 sm:px-6
                lg:max-w-7xl lg:px-8
            "
        >
            <div class="max-w-xl">
                <h2
                    id="faq"
                    class="
                        text-2xl
                        font-extrabold
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                    "
                >
                    Frequently asked questions
                </h2>
                <p class="mt-4 text-base text-gray-500 dark:text-gray-400">
                    If you can't find what you're looking for, feel free to
                    <a
                        href="https://twitter.com/developer_dao"
                        class="font-medium text-blue-600 dark:text-blue-400"
                        target="_blank"
                    >reach us on Twitter @developer_dao
                        <ExternalLinkIcon
                            class="inline-block h-4 w-4 text-blue-400"
                        /> </a>.
                </p>
            </div>

            <dl
                class="
                    mt-12
                    grid grid-cols-1
                    gap-y-10
                    sm:mt-16
                    md:grid-cols-2 md:gap-x-6
                    lg:grid-cols-3
                "
            >
                <div v-for="(faq, index) in faqs" :key="index">
                    <dt
                        class="
                            text-base
                            font-medium
                            text-gray-900
                            dark:text-gray-100
                        "
                    >
                        {{ faq.question }}
                    </dt>
                    <dd
                        class="mt-3 text-sm text-gray-500 dark:text-gray-400"
                        v-html="faq.answer"
                    />
                </div>
            </dl>
        </div>
    </section>
</template>

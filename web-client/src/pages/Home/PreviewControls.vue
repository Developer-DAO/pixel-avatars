<script setup>
import { inject, ref, watchEffect } from 'vue'
import { ChevronUpIcon } from '@heroicons/vue/outline'

const client = inject('web3client')
const state = inject('previewState')
const show = ref(true)

watchEffect(() => {
    show.value = !client.isConnected.value
})
</script>

<template>
    <div class="w-full">
        <button
            v-if="client.isConnected.value"
            type="button"
            class="
                mb-10
                flex
                items-center
                justify-center
                space-x-1
                text-sm text-gray-600
                w-full
                bg-blue-50
                rounded-full
                p-1
            "
            @click="show = !show"
        >
            <span v-if="show">Hide controls</span>
            <span v-else>Show controls</span>
            <ChevronUpIcon
                class="w-4 h-4 transform transition-all"
                :class="{ 'rotate-180': !show }"
            />
        </button>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-out"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <div v-show="show" class="w-full space-y-10">
                <div class="w-full flex flex-col space-y-1">
                    <h3
                        class="
                            text-sm
                            font-bold
                            text-gray-600
                            uppercase
                            tracking-2
                        "
                    >
                        Developer
                    </h3>

                    <input
                        id="developerNo"
                        v-model="state.developer.value"
                        type="number"
                        class="input-text text-center"
                        placeholder="Search no"
                        @change="state.updateTraits"
                    />
                </div>

                <div class="w-full flex flex-col space-y-2">
                    <h3
                        class="
                            text-sm
                            font-bold
                            text-gray-600
                            uppercase
                            tracking-2
                        "
                    >
                        Traits
                    </h3>

                    <div
                        v-for="trait of state.dataTraits"
                        :key="trait.slug"
                        class="relative"
                    >
                        <select
                            v-model="state.traits[trait.slug]"
                            dir="rtl"
                            class="input-select !pr-12"
                            @change="state.updateDeveloper"
                        >
                            <option
                                v-for="value in trait.values"
                                :key="value.slug"
                                :value="value.slug"
                                v-text="value.name"
                            />
                        </select>
                        <div
                            class="
                                absolute
                                left-0
                                top-0
                                bottom-1
                                flex
                                items-center
                                text-sm text-gray-600
                            "
                        >
                            <span v-text="trait.name" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

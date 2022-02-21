<script>
import { SpeakerphoneIcon } from '@heroicons/vue/outline'
import { computed, onUnmounted, ref } from 'vue'

export function useLaunchCounter() {
    const launchDate = new Date(Date.UTC(2022, 1, 22, 2, 22, 2)).getTime()

    const days = ref(null)
    const hours = ref(null)
    const minutes = ref(null)
    const seconds = ref(null)
    const distance = ref(1)
    const loading = ref(true)

    const counter = setInterval(() => {
        // Get today's date and time
        const now = new Date().getTime()

        // Find the distance between now and the count down date
        distance.value = launchDate - now

        // Time calculations for days, hours, minutes and seconds
        days.value = Math.floor(distance.value / (1000 * 60 * 60 * 24))
        hours.value = Math.floor(
            (distance.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        minutes.value = Math.floor(
            (distance.value % (1000 * 60 * 60)) / (1000 * 60)
        )
        seconds.value = Math.floor((distance.value % (1000 * 60)) / 1000)
        loading.value = false

        if (distance.value < 0) {
            clearInterval(counter)
        }
    }, 1000)

    onUnmounted(() => clearInterval(counter))

    return {
        days,
        hours,
        minutes,
        seconds,
        distance,

        loading,
        launched: computed(
            () =>
                distance.value < 0 ||
                document.location.search.includes('fundbriansretirement=true')
        ),
    }
}

export default {
    components: {
        SpeakerphoneIcon,
    },

    setup() {
        return useLaunchCounter()
    },
}
</script>
<template>
    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
        <div
            v-if="!loading && !launched"
            class="bg-indigo-600 dark:bg-indigo-800"
        >
            <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                <div
                    class="
                        flex flex-col
                        space-y-2
                        sm:space-y-0 sm:flex-row sm:items-center
                        justify-between
                        sm:space-x-8
                    "
                >
                    <div class="flex-1 flex items-center">
                        <span class="flex p-2 rounded-lg bg-indigo-800">
                            <SpeakerphoneIcon
                                class="h-6 w-6 text-white"
                                aria-hidden="true"
                            />
                        </span>
                        <p class="ml-3 font-medium text-white truncate">
                            <span class="lg:hidden">
                                Launching on <b>22-2-22 2:22:2 UTC</b>
                            </span>
                            <span class="hidden lg:inline">
                                Ready for take-off! Launching on
                                <b>22-2-22 2:22:2 UTC</b>
                            </span>
                        </p>
                    </div>
                    <div class="w-full sm:max-w-sm">
                        <div class="grid grid-cols-4 gap-1 sm:gap-4">
                            <div class="grid grid-cols-3">
                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-indigo-600
                                        bg-white
                                    "
                                >
                                    <span v-text="days" />
                                </div>
                                <div
                                    class="
                                        col-span-2
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    <span class="hidden md:inline">days</span>
                                    <span class="md:hidden">d</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-3">
                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-indigo-600
                                        bg-white
                                    "
                                >
                                    <span v-text="hours" />
                                </div>
                                <div
                                    class="
                                        col-span-2
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    <span class="hidden md:inline">hrs</span>
                                    <span class="md:hidden">h</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-3">
                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-indigo-600
                                        bg-white
                                    "
                                >
                                    <span v-text="minutes" />
                                </div>
                                <div
                                    class="
                                        col-span-2
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    <span class="hidden md:inline">min</span>
                                    <span class="md:hidden">m</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-3">
                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-indigo-600
                                        bg-white
                                    "
                                >
                                    <span v-text="seconds" />
                                </div>
                                <div
                                    class="
                                        col-span-2
                                        flex
                                        items-center
                                        justify-center
                                        px-4
                                        py-2
                                        border border-transparent
                                        rounded-md
                                        shadow-sm
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    <span class="hidden md:inline">sec</span>
                                    <span class="md:hidden">s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

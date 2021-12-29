<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    color: {
        type: String,
        default: 'black',
    },
})

const colorClass = computed(() => {
    const colors = {
        black: 'bg-black text-white border-black',
        blackOutline: 'bg-white text-gray-900 border-black',
    }

    return colors[props.color]
})
</script>

<template>
    <button
        :class="colorClass"
        class="border rounded text-sm py-3 px-4 w-full disabled:bg-opacity-70"
    >
        <slot />
    </button>
</template>

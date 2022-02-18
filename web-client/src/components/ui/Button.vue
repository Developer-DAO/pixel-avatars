<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    color: {
        type: String,
        default: 'black',
    },
    as: {
        type: String,
        default: 'button',
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
    <component
        :is="as"
        :class="colorClass"
        class="
            inline-block
            text-center
            border
            rounded
            text-sm
            py-3
            px-4
            w-full
            disabled:bg-opacity-70
        "
    >
        <slot />
    </component>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    color: {
        type: String,
        default: 'red',
    },
})

const classes = computed(() => {
    const colors = {
        red: 'bg-red-100 border-red-500 text-red-900 dark:bg-red-700 dark:text-red-100 dark:border-red-400',
        gray: 'bg-gray-100 border-gray-500 text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500',
        green: 'bg-green-100 border-green-500 text-green-900 dark:bg-green-600 dark:text-green-100 dark:border-green-400',
    }

    return colors[props.color] ?? null
})
</script>
<template>
    <div class="mt-3 border-l-2 text-sm rounded p-4" :class="classes">
        <slot />
    </div>
</template>

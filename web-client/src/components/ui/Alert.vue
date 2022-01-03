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
        red: 'bg-red-100 border-red-500 text-red-900',
        yellow: 'bg-yellow-100 border-yellow-500 text-yellow-900',
        green: 'bg-green-100 border-green-500 text-green-900',
    }

    return colors[props.color] ?? null
})
</script>
<template>
    <div class="mt-3 border-l-2 text-sm rounded p-4" :class="classes">
        <slot />
    </div>
</template>

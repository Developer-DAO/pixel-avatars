<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'error',
    },
})

const classes = computed(() => {
    const types = {
        error: 'bg-red-100 border-red-500 text-red-900',
        success: 'bg-green-100 border-green-500 text-green-900',
    }

    return types[props.type] ?? null
})
</script>
<template>
    <div class="mt-3 border-l-2 text-sm rounded p-4" :class="classes">
        <slot />
    </div>
</template>

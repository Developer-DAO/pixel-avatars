<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    modelValue: String,
})

const address = computed(() => {
    return props.modelValue.substr(0, 7) + '...' + props.modelValue.substr(37)
})
</script>
<template>
    <span v-text="address" />
</template>

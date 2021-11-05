<script setup>
import { defineProps } from 'vue'

defineProps({
    state: Object,
})
</script>

<template>
    <div>
        <div class="relative w-full overflow-hidden" style="padding-top: 120%">
            <img
                v-for="layer in state.layers.value"
                :key="layer"
                class="absolute top-0 left-0 w-full"
                :src="layer"
            />
        </div>
    </div>
</template>

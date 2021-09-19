<script setup>
const props = defineProps({
    state: Object
})
</script>

<template>
    <div>
        <div class="relative w-full overflow-hidden" style="padding-top: 120%">
            <img
                v-for="layer in state.layers.value"
                class="absolute top-0 left-0 w-full"
                :key="layer"
                :src="layer"
            />
        </div>

<!--        <div class="mt-4" v-else>-->
<!--            NOT FOUND-->
<!--        </div>-->
    </div>
</template>
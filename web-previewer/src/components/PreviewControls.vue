<script setup>
const props = defineProps({
    state: Object
})
</script>

<template>
    <div class="space-y-10">
        <div class="flex flex-col space-y-1">
            <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
                Developer
            </h3>

            <input
                id="developerNo"
                type="number"
                class="input-text text-center"
                placeholder="Search no"
                v-model="state.developer.value"
                @change="state.updateTraits"
            />
        </div>

        <div class="flex flex-col space-y-2">
            <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
                Traits
            </h3>

            <div class="relative" v-for="trait of state.dataTraits" :key="trait.slug">
                <select
                    dir="rtl"
                    class="input-select !pr-12"
                    v-model="state.traits[trait.slug]"
                    @change="state.updateDeveloper"
                >
                    <option
                        v-for="value in trait.values"
                        v-text="value.name"
                        :value="value.slug"
                        :key="value.slug"
                    />
                </select>
                <div class="absolute left-0 top-0 bottom-1 flex items-center text-sm text-gray-600">
                    <span v-text="trait.name" />
                </div>
            </div>
        </div>
    </div>
</template>
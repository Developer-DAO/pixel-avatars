<script setup>
import { defineProps } from "vue";

defineProps({
  state: Object,
});
</script>

<template>
  <div class="w-full flex flex-col space-y-1">
    <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
      Developer
    </h3>

    <input
      id="developerNo"
      v-model="state.developer.value"
      type="number"
      class="input-text text-center"
      placeholder="Search no"
      @change="state.updateTraits"
    />
  </div>

  <div class="w-full flex flex-col space-y-2">
    <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">Traits</h3>

    <div v-for="trait of state.dataTraits" :key="trait.slug" class="relative">
      <select
        v-model="state.traits[trait.slug]"
        dir="rtl"
        class="input-select !pr-12"
        @change="state.updateDeveloper"
      >
        <option
          v-for="value in trait.values"
          :key="value.slug"
          :value="value.slug"
          v-text="value.name"
        />
      </select>
      <div
        class="
          absolute
          left-0
          top-0
          bottom-1
          flex
          items-center
          text-sm text-gray-600
        "
      >
        <span v-text="trait.name" />
      </div>
    </div>

    <div class="relative">
      <select
        v-model="state.computer.value"
        dir="rtl"
        class="input-select !pr-12"
      >
        <option :value="1">Yes</option>
        <option :value="0">No</option>
      </select>
      <div
        class="
          absolute
          left-0
          top-0
          bottom-1
          flex
          items-center
          text-sm text-gray-600
        "
      >
        <span>Computer</span>
      </div>
    </div>
  </div>
</template>

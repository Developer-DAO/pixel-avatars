<script setup>
import traits from "../data/traits.js";

let list = []

traits.forEach(trait => {
    trait.values.forEach(value => {
        list.push(`${trait.slug}/${value.slug}.svg`)
    })
})

list = list.sort().join("\n")
</script>

<template>
    <textarea :value="list" class="w-full h-48"></textarea>
</template>
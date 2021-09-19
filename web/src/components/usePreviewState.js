import dataDevelopers from '../data/developers.js'
import dataTraits from '../data/traits.js'
import {computed, ref, reactive} from 'vue'

export default function usePreviewState() {
    const developer = ref(1)
    const traits = reactive({})
    const layers = computed(() => {
        // TODO - derive from traits

        const os = 'https://user-images.githubusercontent.com/51840990/133480481-16adbf7c-7c3d-4e35-aa9a-31e354564681.png';
        const computer = 'https://user-images.githubusercontent.com/51840990/133295766-b126eda3-d798-4dd0-89f1-825a52c574d1.png';
        const flag = 'https://user-images.githubusercontent.com/51840990/133310175-2a2eb58f-be74-44f8-9d9d-2ef8fcf0f82f.png'
        const background = 'https://user-images.githubusercontent.com/51840990/133120337-84e6a624-4f58-42ba-8733-1ac9d4b39d71.png'

        return [background, os, computer, flag]
    })

    function updateDeveloper() {
        // Loop through all developers until a full trait match is found
        const _developer = dataDevelopers.find(_developer => {
            return dataTraits.every(trait => {
                return _getTraitSlugFromName(trait, _developer[trait.id]) === traits[trait.slug]
            })
        })

        // Apply developer id. Otherwise reset.
        developer.value = _developer
            ? _developer.id
            : null
    }

    function updateTraits() {
        // Find developer matching id.
        const _developer = dataDevelopers.find(dev => parseInt(dev.id) === parseInt(developer.value))

        // If found developer from current id, apply trait values. Otherwise reset.
        dataTraits.forEach(trait => {
            traits[trait.slug] = _developer
                ? _getTraitSlugFromName(trait, _developer[trait.id])
                : null
        })
    }

    function _getTraitSlugFromName(trait, name) {
        return trait.values.find(value => value.name === name).slug
    }

    // Initialize
    dataTraits.forEach(trait => traits[trait.slug] = null)

    updateTraits()

    return {
        dataTraits,
        developer,
        layers,
        traits,
        updateDeveloper,
        updateTraits,
    }
}
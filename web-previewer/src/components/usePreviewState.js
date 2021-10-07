import dataDevelopers from '../../data/developers.js'
import {default as dataTraits} from '../../data/traits.js'
import {computed, ref, reactive} from 'vue'

export default function usePreviewState() {
    const developer = ref(1)
    const traits = reactive({})
    const computer = ref(1)
    const layers = computed(() => {
        const orderedTraits = [
            'background', 'industry', 'language', 'location', 'mind', 'os', 'texteditor', 'vibe', 'clothing'
        ]

        let _layers = [];

        orderedTraits.forEach(trait => {
            if (traits[trait] != null) {
                _layers.push(`/traits/${trait}/${traits[trait]}.png` )
            }
        })

        if (computer.value) {
            _layers.push(`/traits/computer.png` )
        }

        return _layers
    })

    function updateDeveloper() {
        // Loop through all developers until a full trait match is found
        const _developer = dataDevelopers.find(_developer => {
            return dataTraits.every(trait => {
                return _getTraitSlugFromName(trait, _developer[trait.id] ?? null) === traits[trait.slug]
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
                ? _getTraitSlugFromName(trait, _developer[trait.id] ?? null)
                : null
        })
    }

    function _getTraitSlugFromName(trait, name) {
        return trait.values.find(value => value.name === name)?.slug
    }

    // Initialize
    dataTraits.forEach(trait => traits[trait.slug] = null)

    updateTraits()

    return {
        computer,
        dataTraits,
        developer,
        layers,
        traits,
        updateDeveloper,
        updateTraits,
    }
}
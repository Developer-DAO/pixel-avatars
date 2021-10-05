import developers from "./developers"
import {keyBy} from "lodash-es";

// Temporary solution. Until all assets are ready, we can keep track
// of which ones are currently uploaded here.
// export const traitsWithAssets = ['location', 'mind', 'os', 'texteditor', 'vibe', 'clothing']

const traits = (() => {
    const traitsList = Object.keys(developers[0]).filter(trait => trait !== 'id')
    let traitsMap = {}

    // Manually add backgrounds
    traitsMap.background = {
        ...buildTrait('background'),

        values: keyBy(
            ['Blue', 'Gray', 'Green', 'Orange', 'Pink', 'Purple', 'Yellow'].map(buildValue),
            'slug'
        )
    }

    // Discover traits from developers
    developers.forEach(developer => {
        traitsList.forEach(trait => {
            const _trait = buildTrait(trait)
            const _value = buildValue(developer[trait])

            if (traitsMap[_trait.slug] == null) {
                traitsMap[_trait.slug] = _trait
            }

            if (traitsMap[_trait.slug].values[_value.slug] == null) {
                traitsMap[_trait.slug].values[_value.slug] = _value
            }
        })
    })

    return Object
        .values(traitsMap)
        .map(trait => {
            return {
                ...trait,

                // Sort values by name
                values: Object.values(trait.values).sort(by('name'))
            }
        })
})()

function buildTrait(traitId) {
    return {
        id: traitId,
        slug: slugify(traitId),
        name: titleCase(traitId),
        values: {}
    }
}

function buildValue(valueId) {
    return {
        slug: slugify(valueId),
        name: valueId
    }
}

function slugify(name) {
    return name
        .toLowerCase()
        .replaceAll(' ', '')
        .replaceAll('&', 'and')
        .replaceAll('+', '')
        .replaceAll('/', '')
        .replaceAll('.', '')
}

function by(key) {
    return (a,b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0)
}

function titleCase(text) {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export default traits
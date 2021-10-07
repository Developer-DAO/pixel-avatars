import developers from "./developers.js"

const traits = (() => {
    const traitsList = Object.keys(developers[0]).filter(trait => trait !== 'id')
    let traitsMap = {}

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

export function buildValue(valueId) {
    return {
        slug: slugify(valueId),
        name: valueId
    }
}

export function slugify(name) {
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
import developers from "./developers"

// Temporary solution. Until all assets are ready, we can keep track
// of which ones are currently uploaded here.
export const traitsWithAssets = ['location', 'mind', 'os', 'texteditor', 'vibe']

const traits = (() => {
    const traitsList = Object.keys(developers[0]).filter(trait => trait !== 'id')
    let traitsMap = {}

    developers.forEach(developer => {
        traitsList.forEach(trait => {
            const traitSlug = slugify(trait)
            const traitValueSlug = slugify(developer[trait])

            if (traitsMap[traitSlug] == null) {
                traitsMap[traitSlug] = {
                    id: trait,
                    slug: traitSlug,
                    name: titleCase(trait),
                    values: {}
                }
            }

            if (traitsMap[traitSlug].values[traitValueSlug] == null) {
                traitsMap[traitSlug].values[traitValueSlug] = {
                    slug: traitValueSlug,
                    name: developer[trait]
                }
            }
        })
    })


    return Object
        .values(traitsMap)
        .map(trait => {
            return {
                ...trait,

                values: Object.values(trait.values).sort(by('name'))
            }
        })
})()

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
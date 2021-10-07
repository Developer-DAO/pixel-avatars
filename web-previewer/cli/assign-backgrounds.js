import {keyBy, sample} from "lodash-es"
import {buildValue, default as traits, slugify} from '../data/traits.js'
import developers from '../data/developers.js'
import fs from 'fs'
import path from 'path'

/*
 * Script can be invoked by running `yarn assign-backgrounds`.
 * Before running script please add `"type": "module",` to
 * package.json and remove it again once done.
 */

const backgrounds = ['Blue', 'Gray', 'Green', 'Orange', 'Pink', 'Purple', 'Yellow'].map(buildValue)

const newDevelopers = developers.map(developer => {
    return {
        ...developer,
        background: sample(getCompatibleBackgrounds(developer)).name
    }
})

fs.writeFile(
    path.resolve('data/developers.js'),
    'export default ' + JSON.stringify(newDevelopers, null, 4),
    () => console.log("Successfully updated developers.json!")
)

function getCompatibleBackgrounds(developer) {
    let compatibleBackgrounds = keyBy(backgrounds, 'slug')
    const vibe = slugify(developer.vibe)
    const clothing = slugify(developer.clothing)

    if (vibe === 'jongold') {
        delete compatibleBackgrounds.blue
    }

    if (vibe === 'kind') {
        delete compatibleBackgrounds.blue
    }

    if (vibe === 'generous') {
        delete compatibleBackgrounds.yellow
    }

    if (vibe === 'hyper') {
        delete compatibleBackgrounds.orange
    }

    if (vibe === 'cosmic') {
        delete compatibleBackgrounds.purple
        delete compatibleBackgrounds.green
    }

    if (vibe === 'phobia') {
        delete compatibleBackgrounds.purple
        delete compatibleBackgrounds.green
    }

    if (clothing === 'conferencenet') {
        delete compatibleBackgrounds.orange
    }

    if (clothing === 'whitetanktop') {
        delete compatibleBackgrounds.grey
    }

    if (clothing === 'platinumtrenchcoat') {
        delete compatibleBackgrounds.grey
    }

    if (clothing === 'bubblegumwrapper') {
        delete compatibleBackgrounds.pink
    }

    if (clothing === 'pinkhoodie') {
        delete compatibleBackgrounds.pink
    }

    return Object.values(compatibleBackgrounds)
}
import dataDevelopers from "../../data/developers.js";
import { default as dataTraits } from "../../data/traits.js";
import { computed, ref, reactive, onMounted } from "vue";

export default function usePreviewState() {
  const developerId = ref(1);
  const traits = reactive({});
  const computer = ref(0);

  onMounted(() => {
    // Initialize
    dataTraits.forEach((trait) => (traits[trait.slug] = null));

    updateTraits();
  });

  const layers = computed(() => {
    const orderedTraits = [
      "background",
      "industry",
      "language",
      "location",
      "mind",
      "os",
      "texteditor",
      "vibe",
      "clothing",
    ];

    let _layers = [];

    orderedTraits.forEach((trait) => {
      if (traits[trait] != null) {
        _layers.push(`/traits/${trait}/${traits[trait]}.png`);
      }
    });

    if (computer.value) {
      _layers.push(`/traits/computer.png`);
    }

    return _layers;
  });

  function updateDeveloper() {
    // Loop through all developers until a full trait match is found
    const _developer = dataDevelopers.find((_developer) => {
      return dataTraits.every((trait) => {
        return (
          _getTraitSlugFromName(trait, _developer[trait.id] ?? null) ===
          traits[trait.slug]
        );
      });
    });

    // Apply developer id. Otherwise reset.
    developerId.value = _developer ? _developer.id : null;
  }

  function updateTraits() {
    // Find developer matching id.
    const _developer = dataDevelopers.find(
      (dev) => parseInt(dev.id) === parseInt(developerId.value)
    );

    // If found developer from current id, apply trait values. Otherwise reset.
    dataTraits.forEach((trait) => {
      traits[trait.slug] = _developer
        ? _getTraitSlugFromName(trait, _developer[trait.id] ?? null)
        : null;
    });
  }

  function _getTraitSlugFromName(trait, name) {
    return trait.values.find((value) => value.name === name)?.slug;
  }

  return {
    computer,
    dataTraits,
    developerId,
    layers,
    traits,
    updateDeveloper,
    updateTraits,
  };
}

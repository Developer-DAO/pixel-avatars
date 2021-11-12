<script setup>
import {defineProps, ref, watch} from 'vue'

const props = defineProps({
  previewState: Object,
  walletState: Object,
})

const claimToken = ref(null)

const CLAIMING_STATES = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error"
})

const claimingState = ref(CLAIMING_STATES.IDLE)


function updatePreview() {
  props.previewState.developer.value = claimToken.value
  props.previewState.updateTraits()
}

function getButtonText() {
  switch (claimingState.value) {
    case CLAIMING_STATES.IDLE:
      return "Claim avatar"
    case CLAIMING_STATES.SUCCESS:
      return "Successfully claimed avatar 🚀 "
    case CLAIMING_STATES.LOADING :
      return "Claiming..."
    default:
      return "Claiming failed"
  }
}

async function startClaiming() {
  try {
    claimingState.value = CLAIMING_STATES.LOADING;
    await props.walletState.claim(claimToken.value);
    claimingState.value = CLAIMING_STATES.SUCCESS;
  } catch (e) {
    console.error(e);
    claimingState.value = CLAIMING_STATES.ERROR;
  }
}

watch(props.previewState.developer, (developer) => {
  if (claimToken.value === developer) {
    return
  }

  if (props.walletState.tokens.value.indexOf(developer) > -1) {
    claimToken.value = developer
    return
  }

  claimToken.value = null
})
</script>

<template>
  <div v-if="walletState.isConnected.value">
    <h3 class="text-sm font-bold text-gray-600 uppercase tracking-2">
      Your personal avatars
    </h3>

    <p class="mt-2 text-gray-600 text-sm">
      Here is a list of genesis tokens owned by your connected account.
      <br/>
      Please select the token number you wish to claim.
    </p>

    <div class="mt-3 relative">
      <select
          v-model="claimToken"
          dir="rtl"
          class="input-select !pr-12"
          @change="updatePreview"
      >
        <option :value="null"/>
        <option
            v-for="token in walletState.tokens.value"
            :key="token"
            :value="token"
            v-text="token"
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
        <span>Your personal tokens</span>
      </div>
    </div>

    <div class="mt-5 text-right">
      <button
          v-text="getButtonText()"
          v-if="claimToken"
          class="
                    bg-black
                    text-white
                    rounded
                    text-sm
                    py-3
                    px-4
                    w-full
                    max-w-[12rem]
                "
          @click="startClaiming()"
      >

      </button>
    </div>
  </div>
</template>

<script setup>
import ClaimControls from "../components/ClaimControls.vue";
import DaoLogo from "../components/DaoLogo.vue";
import Preview from "../components/Preview.vue";
import PreviewControls from "../components/PreviewControls.vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import usePreviewState from "../components/usePreviewState";
import useWalletState from "../components/useWalletState";

const previewState = usePreviewState();
const walletState = useWalletState();
</script>

<template>
  <div class="min-h-screen flex flex-col sm:flex-row">
    <div class="sm:w-2/5 bg-white py-10 px-4 flex">
      <div
        class="
          flex flex-col
          items-center
          justify-center
          space-y-10
          w-full
          max-w-md
          mx-auto
        "
      >
        <div class="flex justify-between items-center w-full">
          <DaoLogo class="w-16 h-16 rounded-full shadow-md" />

          <ConnectWallet :state="walletState" />
        </div>

        <ClaimControls
          :preview-state="previewState"
          :wallet-state="walletState"
          class="w-full max-w-md"
        />

        <PreviewControls :state="previewState" class="w-full max-w-md" />
      </div>
    </div>

    <div class="sm:w-3/5 bg-gray-100 border-l border-gray-200">
      <div
        class="
          flex
          items-center
          justify-center
          sm:min-h-screen sm:sticky sm:top-0
        "
      >
        <Preview :state="previewState" class="w-full max-w-md" />
      </div>
    </div>
  </div>
</template>

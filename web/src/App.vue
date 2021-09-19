<script setup>
import DaoLogo from "./components/DaoLogo.vue";
import Preview from "./components/Preview.vue"
import PreviewControls from "./components/PreviewControls.vue";
import usePreviewState from "./components/usePreviewState";

const previewState = usePreviewState()
</script>

<template>
    <div class="min-h-screen flex flex-col sm:flex-row">
        <div class="sm:w-2/5 bg-white flex flex-col items-center space-y-10 py-10 px-4">
            <DaoLogo class="w-32 h-32 block mx-auto rounded-full shadow-md" />

            <PreviewControls
                :state="previewState"
                class="w-full max-w-xs"
            />
        </div>

        <div class="sm:w-3/5 bg-gray-100 border-l border-gray-200 flex items-center justify-center">
            <Preview
                :state="previewState"
                class="w-full max-w-md"
            />
        </div>
    </div>
</template>
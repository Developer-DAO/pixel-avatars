import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useRouteParameterSync(previewState) {
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
        if (route.query.developerId) {
            previewState.developer.value = route.query.developerId
            previewState.updateTraits()
        }
    })

    watch(previewState.developer, (developer) => {
        router.push({ path: '/', query: {
            ...route.query,

            developerId: developer }
        })
    })
}

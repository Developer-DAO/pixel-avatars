import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useRouteParameterSync(previewState) {
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
        if (route.query.developerId) {
            previewState.developer.value = route.query.developerId
        }
    })

    watch(previewState?.developer, (developer, previousdeveloper) => {
        router.push({ path: '/', query: { developerId: developer } })
    })
}

import { watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default function useRouteParameterSync(previewState) {
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    if (route.query.id) {
      previewState.developerId.value = route.query.id;
    }
  });

  watch(previewState?.developerId, (developerId, previousDeveloperId) => {
    router.push({ path: "/", query: { id: developerId } });
  });
}

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { useExamStore } from "./stores/exam";
import { useLevelStore } from "./stores/levels";
import { useUserStore } from "./stores/users";
import { loadMockData } from "./services/mockData";
import "@fontsource-variable/outfit";
import "nprogress/nprogress.css";
import "./assets/main.css";
import { configureApiAuth } from "@/services/api";
import StartupError from '@/components/shared/StartupError.vue'

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  const auth = useAuthStore(pinia);

  configureApiAuth({
    getSessionVersion: () => auth.getSessionVersion(),

    onRefreshed: (response) => {
      auth.acceptRefreshedSession(response);
    },

    onExpired: () => {
      auth.clearSession();

      if (
        router.currentRoute.value.matched.length > 0 &&
        router.currentRoute.value.name !== "login"
      ) {
        void router.replace({ name: "login" }).catch(() => {
          console.error("Unable to open the sign-in page.");
        });
      }
    },
  });

  const database = await loadMockData();
  useUserStore(pinia).hydrate(database.users);
  useLevelStore(pinia).hydrate(database);
  useExamStore(pinia).hydrate(database);
  await useAuthStore(pinia).restore();

  app.use(router);
  app.mount("#app");
}

void bootstrap().catch(() => {
  createApp(StartupError).mount('#app')
})

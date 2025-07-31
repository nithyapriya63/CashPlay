import { boot } from "quasar/wrappers";
import axios from "axios";
import { useAuthStore } from "src/stores/authStore";

const api = axios.create({
  baseURL: "http://13.126.33.54:9092",
});

// ✅ Add request interceptor globally
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Refresh-Token"] = authStore.token.refreshToken;
    config.headers["X-User-Email"] = authStore.email;
  }

  return config;
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };

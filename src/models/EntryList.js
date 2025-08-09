import { useAuthStore } from "src/stores/authStore";

export function getDefaultEntryRequest({
  year = new Date().getFullYear(),
  month = new Date().toLocaleString("default", { month: "long" }).toUpperCase(),
  groupByType = "MONTHLY",
} = {}) {
  const authStore = useAuthStore();
  const user = authStore.user || {};
  const token = authStore.token || {};

  return {
    year,
    month,
    groupByType,
    user: {
      id: user.id || 0,
      emailId: user.emailId || "",
      code: user.code || 0,
      expirationTime: user.expirationTime || new Date().toISOString(),
      accessToken: token.accessToken || "",
      refreshToken: token.refreshToken || "",
      status: user.status || "ACTIVE",
    },
  };
}

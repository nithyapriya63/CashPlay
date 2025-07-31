import { useAuthStore } from "src/stores/authStore";

export function getDefaultEntryRequest({
  year = new Date().getFullYear(),
  month = "JANUARY",
  groupByType = "MONTHLY",
}) {
  const authStore = useAuthStore();

  return {
    year,
    month,
    groupByType,
    user: {
      id: 0, // You can replace this with actual userId if available
      emailId: authStore.email,
      code: 0,
      expirationTime: new Date().toISOString(), // current time
      accessToken: authStore.token.accessToken,
      refreshToken: authStore.token.refreshToken,
      status: "ACTIVE",
    },
  };
}

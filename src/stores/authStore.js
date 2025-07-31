import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "src/services/authService";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // state
    const email = ref("");
    const otpSent = ref(false);
    const token = ref({
      accessToken: "",
      refreshToken: "",
    });

    // Computed user object
    const user = computed(() => ({
      id: 1,
      emailId: email.value,
      accessToken: token.value.accessToken,
      refreshToken: token.value.refreshToken,
      code: 0,
    }));

    // getters
    const isAuthenticated = computed(() => !!token.value.accessToken);

    // actions

    async function registerUser(userEmail) {
      try {
        const res = await authService.register(userEmail);
        email.value = userEmail;
        otpSent.value = true;
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Registration failed";
      }
    }

    async function loginUser(otp) {
      try {
        const res = await authService.login(email.value, otp);
        token.value = {
          accessToken: res.data.accessToken || "",
          refreshToken: res.data.refreshToken || "",
        };
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Login failed";
      }
    }

    async function logout(router) {
      try {
        if (email.value && token.value.accessToken) {
          await authService.logout(email.value, token.value.accessToken);
        }
      } catch (error) {
        console.warn("Logout failed:", error.message);
      }

      token.value = { accessToken: "", refreshToken: "" };
      email.value = "";
      otpSent.value = false;
      router.replace("/login");
    }

    function handleAppReopen(router) {
      const isFirstLoad = !sessionStorage.getItem("sessionStarted");
      if (isFirstLoad) {
        sessionStorage.setItem("sessionStarted", "true");
        token.value = { accessToken: "", refreshToken: "" };
        email.value = "";
        otpSent.value = false;
        router.replace({ name: "login" });
      }
    }

    return {
      email,
      otpSent,
      token,
      isAuthenticated,
      user,
      registerUser,
      loginUser,
      logout,
      handleAppReopen,
    };
  },
  {
    persist: {
      paths: ["token", "email", "user"],
    },
  }
);

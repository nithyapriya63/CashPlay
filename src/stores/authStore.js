import { defineStore } from "pinia";
import authService from "src/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: localStorage.getItem("email") || "",
    otpSent: false,
    token: localStorage.getItem("token") || "",
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async registerUser(email) {
      try {
        const res = await authService.register(email);
        this.email = email;
        this.otpSent = true;
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Registration failed";
      }
    },

    async loginUser(otp) {
      try {
        const res = await authService.login(this.email, otp);
        this.token = res.data.token;
        localStorage.setItem("email", this.email);
        localStorage.setItem("token", this.token);
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Login failed";
      }
    },

    async logout(router) {
      const email = this.email;
      const token = this.token;

      if (!email || !token) {
        console.warn("Missing email or token, skipping logout API call");
      } else {
        try {
          await authService.logout(email, token);
        } catch (error) {
          console.warn(
            "Logout API error:",
            error?.response?.data || error.message
          );
        }
      }

      this.token = "";
      this.email = "";
      this.otpSent = false;
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      router.replace("/login");
    },
  },
});

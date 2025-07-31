import { api } from "src/boot/axios";

export default {
  async register(email) {
    return api.post("auth/register", { emailId: email });
  },

  async login(email, otp) {
    return api.post("auth/login", { emailId: email, otp });
  },
  async logout(email, token) {
    return api.delete("auth/user-logout", {
      params: {
        email: email,
        token: token,
      },
    });
  },
};

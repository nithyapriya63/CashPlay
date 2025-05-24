import axios from "axios";

const API = axios.create({
  baseURL: "http://13.235.125.99:9092",
});

export default {
  async register(email) {
    return API.post("auth/register", { emailId: email });
  },

  async login(email, otp) {
    return API.post("auth/login", { emailId: email, otp });
  },
  async logout(email, token) {
    return API.delete("auth/user-logout", {
      params: {
        email: email,
        token: token,
      },
    });
  },
};

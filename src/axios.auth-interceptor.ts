import axios from "axios";
import store from "@/store";

axios.interceptors.request.use(
  config => {
    const user = store.getters["auth/user"];
    if (user) {
      config.headers["Authorization"] = "Bearer " + user.idToken;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

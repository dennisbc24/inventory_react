import axios from "axios";
import { showToast } from "../utils/toast.js";

axios.interceptors.request.use(
  (config) => {
    const logged = window.localStorage.getItem("loggedAppUser");
    if (logged) {
      try {
        const { token } = JSON.parse(logged);
        if (token && !config.url.includes("/auth/login")) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config && error.config.url;
    if (error.response && error.response.status === 401 && !(url && url.includes("/auth/login"))) {
      window.localStorage.removeItem("loggedAppUser");
      window.location.href = "/";
    }
    if (error.response && error.response.status === 503) {
      showToast(error.response.data?.message || "Sin conexión a la base de datos");
    }
    if (!error.response && error.request && !(url && url.includes("/auth/login"))) {
      showToast("Sin conexión con el servidor");
    }
    return Promise.reject(error);
  }
);
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.DASHBOARD_BACKEND_URL || "http://localhost:8000/api",

  withCredentials: false,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

instance.interceptors.request.use(
  function (config) {
    if (localStorage.getItem("token")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }

    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      window.localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;

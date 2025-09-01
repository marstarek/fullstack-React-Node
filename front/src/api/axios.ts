import axios from "axios";
import { logout } from "@/store/authSlice";
import { store } from "@/store";
import { baseURL } from "./../constants/config";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request error!");
    return Promise.reject(error);
  }
);

// ✅ Handle expired/invalid token & show toast for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        toast.error("Session expired, please login again.");
        store.dispatch(logout());
      } else if (status === 403) {
        toast.error("You don’t have permission to do this.");
      } else if (status >= 500) {
        toast.error("Server error, please try again later.");
      } else {
        toast.error(error.response.data?.message || "Request failed.");
      }
    } else {
      toast.error("Network error, check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;

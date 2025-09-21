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

// ✅ Add accessToken automatically
api.interceptors.request.use(
  (config) => {
    // 1. Try Redux accessToken first (fresh in memory)
    const reduxToken = store.getState().auth.accessToken;
    
    // 2. Fallback to localStorage accessToken
    const localToken = localStorage.getItem("accessToken");
    console.log(store.getState(),localToken)

    const accessToken = reduxToken || localToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // else {
    //   delete config.headers.Authorization; // no token → no header
    // }

    return config;
  },
  (error: unknown) => {
    toast.error("Request error!");
    return Promise.reject(error);
  }
);

// ✅ Handle expired/invalid accessToken
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const status = error.response.status;

//       if (status === 401) {
//         toast.error("Session expired, please login again.");
//         store.dispatch(logout());
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//       } else if (status === 403) {
//         toast.error("You don’t have permission to do this.");
//       } else if (status >= 500) {
//         toast.error("Server error, please try again later.");
//       } else {
//         toast.error(error.response.data?.message || "Request failed.");
//       }
//     } else {
//       toast.error("Network error, check your connection.");
//     }

//     return Promise.reject(error);
//   }
// );

export default api;

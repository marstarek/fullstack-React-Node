// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
};

import api from "@/api/axios";
import toast from "react-hot-toast";

// 🔹 Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/login", credentials);
       toast.success("Logged in successfully!");
      return res.data; // { user, accessToken }
    } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed"); // 🔥 toast on error

      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// 🔹 Fetch authenticated user data (accessToken auto-attached via interceptor)
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/authUserData");
      console.log(res.data)
      return res.data; // { user, accessToken }
    } catch (err: any) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        console.log(action.payload.accessToken)
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 fetch user
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        console.log(action.payload) 
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

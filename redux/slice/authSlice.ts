// src/redux/slice/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

// Initialize state safely
const storedUser = getLocalStorageItem("user");
const storedToken = getLocalStorageItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
  },
});

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean =>
  Boolean(state.auth.token);

export const selectUser = (state: { auth: AuthState }): User | null => state.auth.user;

export const { setUserCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

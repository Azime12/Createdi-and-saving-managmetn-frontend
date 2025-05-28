// src/redux/slice/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[authSlice] Setting token in store', action.payload ? 'exists' : 'null');
      }
      state.token = action.payload;
    },
    clearToken: (state) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[authSlice] Clearing token from store');
      }
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
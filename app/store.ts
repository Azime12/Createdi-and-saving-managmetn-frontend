import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../redux/api/apiSlice'; // Update to match the correct filename
import userReducer from '../redux/slice/userSlice'; // Example user slice
import authReducer from '../redux/slice/authSlice'; // Example auth slice

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Add RTK Query reducer
    user: userReducer,
    auth: authReducer,
    // Other reducers...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});

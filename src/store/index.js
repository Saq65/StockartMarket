import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
  },
});
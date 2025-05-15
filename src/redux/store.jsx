import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
  },
});

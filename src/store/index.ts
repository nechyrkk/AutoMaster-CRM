import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import calendarReducer from './calendarSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    calendar: calendarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

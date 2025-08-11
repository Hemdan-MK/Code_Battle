
// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatSlice from './chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
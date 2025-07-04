
// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
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
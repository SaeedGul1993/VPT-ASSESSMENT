import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createTransform,
  persistReducer,
  persistStore,
} from 'redux-persist';
import baseApi from '../services/api';
import authReducer, { type AuthState } from './authSlice';

/** Tokens stay in Keychain only — never written to AsyncStorage */
const stripTokensTransform = createTransform(
  (inboundState: AuthState): AuthState => ({
    ...inboundState,
    token: null,
    refreshToken: null,
  }),
  (outboundState: AuthState) => outboundState,
  { whitelist: ['auth'] },
);

const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'health-survey-mobile',
  storage: AsyncStorage,
  whitelist: ['auth'],
  transforms: [stripTokensTransform],
};

// redux-persist types widen slice state to Partial — cast keeps RootState clean
const persistedReducer = persistReducer(
  persistConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootReducer as any,
) as unknown as typeof rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistStored = persistStore(store);

setupListeners(store.dispatch);

export type RootState = RootReducerState;
export type AppDispatch = typeof store.dispatch;

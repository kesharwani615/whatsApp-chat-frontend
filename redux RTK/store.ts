import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../redux RTK/api/dummy";
import { Authapi } from "./api/auth";
import idSlice from "./slice/chat";
import { userapi } from "./api/users";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [Authapi.reducerPath]: Authapi.reducer,
    [userapi.reducerPath]: userapi.reducer,
    idSlice: idSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(Authapi.middleware)
      .concat(userapi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
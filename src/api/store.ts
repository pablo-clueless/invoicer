import { configureStore } from "@reduxjs/toolkit";

import { customerApi } from "./customer/api";
import { invoiceApi } from "./invoice/api";
import { authApi } from "./auth/api";
import { api } from "./base/api";
import auth from "./auth/slice";

export const store = configureStore({
  reducer: {
    [customerApi.reducerPath]: customerApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [api.reducerPath]: api.reducer,
    auth: auth,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(customerApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(authApi.middleware)
      .concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

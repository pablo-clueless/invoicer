import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { COOKIE_NAME } from "@/config";

export const customerApi = createApi({
  reducerPath: "customer-api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URI,
    prepareHeaders: (headers) => {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Customer"],
  endpoints: () => ({}),
});

export const {} = customerApi;

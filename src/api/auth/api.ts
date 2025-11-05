import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { COOKIE_NAME } from "@/config";

export const authApi = createApi({
  reducerPath: "auth-api",
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
  tagTypes: ["Authentication", "User"],
  endpoints: (builder) => ({
    google: builder.query({
      query: () => ({
        url: "/auth/google",
        method: "POST",
      }),
    }),
    googleCallback: builder.query({
      query: () => ({
        url: "/auth/google/callback",
        method: "POST",
      }),
    }),
    signout: builder.query({
      query: () => ({
        url: "/auth/signout",
        method: "GET",
      }),
    }),
  }),
});

export const { useGoogleCallbackQuery, useGoogleQuery, useSignoutQuery } = authApi;

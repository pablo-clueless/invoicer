import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import type { HttpResponse, UpdateUserDto, UserProps } from "@/types";
import { COOKIE_NAME } from "@/config";

export const userApi = createApi({
  reducerPath: "user-api",
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
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    updateUser: builder.mutation<HttpResponse<UserProps>, UpdateUserDto>({
      query: (payload) => ({
        url: "/users",
        method: "PUT",
        body: payload,
      }),
    }),
    deleteUser: builder.mutation<HttpResponse<string>, undefined>({
      query: () => ({
        url: "/users",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteUserMutation, useUpdateUserMutation } = userApi;

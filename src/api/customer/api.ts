import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import { COOKIE_NAME } from "@/config";
import type { CustomerDto, CustomerProps, HttpResponse, PaginatedParams, PaginatedResponse } from "@/types";

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
  endpoints: (builder) => ({
    createCustomer: builder.mutation<HttpResponse<CustomerProps>, CustomerDto>({
      query: (payload) => ({
        url: "/customers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<HttpResponse<CustomerProps>, { id: string; payload: Partial<CustomerDto> }>({
      query: ({ id, payload }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation<HttpResponse<CustomerProps>, string>({
      query: () => ({
        url: `/customers`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    getCustomers: builder.query<HttpResponse<PaginatedResponse<CustomerProps>>, PaginatedParams & { query?: string }>({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params,
      }),
      providesTags: ["Customer"],
    }),
    getCustomer: builder.query<HttpResponse<CustomerProps>, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerQuery,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} = customerApi;

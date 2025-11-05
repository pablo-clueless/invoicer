import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

import type {
  HttpResponse,
  InvoiceDto,
  InvoiceProps,
  PaginatedParams,
  PaginatedResponse,
  UpdateInvoiceDto,
} from "@/types";
import { COOKIE_NAME } from "@/config";

export const invoiceApi = createApi({
  reducerPath: "invoice-api",
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
    createInvoice: builder.mutation<HttpResponse<InvoiceProps>, InvoiceDto>({
      query: (payload) => ({
        url: "/invoices",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Invoice"],
    }),
    updateInvoice: builder.mutation<HttpResponse<InvoiceProps>, { id: string; payload: UpdateInvoiceDto }>({
      query: ({ id, payload }) => ({
        url: `/invoices/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Invoice"],
    }),
    deleteInvoice: builder.mutation<HttpResponse<InvoiceProps>, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
    getInvoices: builder.query<HttpResponse<PaginatedResponse<InvoiceProps>>, PaginatedParams & { query?: string }>({
      query: (params) => ({
        url: "/invoices",
        method: "GET",
        params,
      }),
      providesTags: ["Invoice"],
    }),
    getInvoice: builder.query<HttpResponse<InvoiceProps>, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoiceQuery,
  useGetInvoicesQuery,
  useUpdateInvoiceMutation,
} = invoiceApi;

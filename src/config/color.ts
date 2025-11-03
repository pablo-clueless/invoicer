import type { InvoiceStatus } from "@/types";

export const INVOICE_STATUS: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-500",
  overdue: "bg-red-100 text-red-500",
  paid: "bg-green-100 text-green-500",
  pending: "bg-yellow-100 text-yellow-500",
};

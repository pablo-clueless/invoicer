import type { InvoiceStatus } from "@/types";

type InvoiceStatusProps = {
  label: string;
  value: InvoiceStatus;
};

export const INVOICE_STATUSES: InvoiceStatusProps[] = [
  { label: "Draft", value: "draft" },
  { label: "Overdue", value: "overdue" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
];

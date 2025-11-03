import type { InvoiceDto } from "@/types";

export const getInvoiceTotal = (payload: InvoiceDto) => {
  const subtotal = payload.items.reduce((acc, item) => acc + item.lineTotal, 0);
  const discount = payload.discountType === "fixed" ? payload.discount : subtotal * (payload.discount / 100);
  const tax = payload.taxType === "fixed" ? payload.tax : subtotal * (payload.tax / 100);
  const total = subtotal - discount + tax;

  return {
    discount,
    subtotal,
    tax,
    total,
  };
};

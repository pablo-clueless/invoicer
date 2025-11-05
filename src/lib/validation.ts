import type { InvoiceDto, ValidationError, ValidationProps } from "@/types";

export const validateInvoiceDto = (payload: InvoiceDto): ValidationProps => {
  const errors: ValidationError[] = [];

  if (!payload.title) {
    errors.push({ field: "title", message: "Title is required" });
  }
  if (!payload.currency) {
    errors.push({ field: "currency", message: "Currency is required" });
  }
  if (!payload.dateDue) {
    errors.push({ field: "date due", message: "Due date is required" });
  }
  if (!payload.items.length) {
    errors.push({ field: "items", message: "At least one item is required" });
    payload.items.some((item) => {
      if (!item.description) {
        errors.push({ field: "description", message: "Description is required", index: payload.items.indexOf(item) });
      }
      if (!item.price) {
        errors.push({ field: "price", message: "Price is required", index: payload.items.indexOf(item) });
      }
      if (!item.quantity) {
        errors.push({ field: "quantity", message: "Quantity is required", index: payload.items.indexOf(item) });
      }
    });
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
};

import type { CustomerProps, DiscountType } from "./app";
import type { Maybe } from "./util";

export interface InvoiceDto {
  currency: string;
  customer: Maybe<CustomerProps>;
  customerId: string;
  dateDue?: Date;
  dateIssued: Date;
  discount: number;
  discountType: DiscountType;
  items: InvoiceItemDto[];
  note: string;
  subTotal: number;
  tax: number;
  taxType: DiscountType;
  title: string;
  total: number;
}

export interface InvoiceItemDto {
  description: string;
  lineTotal: number;
  price: number;
  quantity: number;
}

export interface CustomerDto {
  email: string;
  name: string;
  phone: string;
}

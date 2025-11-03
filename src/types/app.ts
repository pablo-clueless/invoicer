export type DiscountType = "fixed" | "percentage";

export interface InvoiceProps {
  companyName: string;
  companyLogo: string;
  createdAt: Date;
  currency: string;
  customer: CustomerProps;
  dateDue: Date;
  dateIssued: Date;
  discount: number;
  discountType: DiscountType;
  id: string;
  items: InvoiceItemProps[];
  note: string;
  subTotal: number;
  tax: number;
  taxType: DiscountType;
  title: string;
  total: number;
  updatedAt: Date;
}

export interface InvoiceItemProps {
  id: string;
  description: string;
  lineTotal: number;
  price: number;
  quantity: number;
}

export interface CustomerProps {
  createdAt: Date;
  id: string;
  email: string;
  name: string;
  phone: string;
  updatedAt: Date;
}

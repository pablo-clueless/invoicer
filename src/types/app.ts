export type InvoiceStatus = "pending" | "paid" | "overdue" | "draft";
export type DiscountType = "fixed" | "percentage";

export interface UserProps {
  bankInformation: BankInformationProps;
  companyLogo: string;
  companyName: string;
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  phone: string;
  updatedAt: Date;
}

export interface BankInformationProps {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankSwiftCode: string;
}

export interface InvoiceProps {
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
  status: InvoiceStatus;
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

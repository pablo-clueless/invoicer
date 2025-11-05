import type { DiscountType, InvoiceStatus } from "./app";

export interface InvoiceDto {
  currency: string;
  customerId: string;
  dateDue: Date | undefined;
  discount: number;
  discountType: DiscountType;
  isDraft: boolean;
  items: InvoiceItemDto[];
  note: string;
  tax: number;
  taxType: DiscountType;
  title: string;
}

export interface UpdateInvoiceDto {
  currency: string;
  customerId: string;
  dateDue: Date | undefined;
  discount: number;
  discountType: DiscountType;
  items: InvoiceItemDto[];
  note: string;
  tax: number;
  taxType: DiscountType;
  title: string;
  status: InvoiceStatus;
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

export interface UpdateUserDto {
  bankInformation: BankInformationDto;
  companyLogo: File | null;
  companyName: string;
  email: string;
  name: string;
  phone: string;
  rcNumber: string;
  taxId: string;
  website: string;
}

interface BankInformationDto {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankSwiftCode: string;
  iban: string;
  routingNumber: string;
}

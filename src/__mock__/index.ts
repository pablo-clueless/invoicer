import { faker } from "@faker-js/faker";

import type { CustomerProps, DiscountType, InvoiceItemProps, InvoiceProps, InvoiceStatus } from "@/types";
import { addDays } from "date-fns";

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const MOCK_CUSTOMERS: CustomerProps[] = Array.from({ length: 20 }, () => {
  return {
    createdAt: new Date(),
    email: faker.internet.email(),
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    updatedAt: new Date(),
  };
});

const INVOICE_STATUS: InvoiceStatus[] = ["draft", "overdue", "paid", "pending"];
const DISCOUNT_TYPE: DiscountType[] = ["fixed", "percentage"];

export const MOCK_INVOICES: InvoiceProps[] = Array.from({ length: 10 }, () => {
  const customer = getRandomItem(MOCK_CUSTOMERS);
  const status = getRandomItem(INVOICE_STATUS);
  const taxType = getRandomItem(DISCOUNT_TYPE);
  const itemCount = faker.number.int({ min: 1, max: 5 });
  const items: InvoiceItemProps[] = Array.from({ length: itemCount }, () => {
    const quantity = faker.number.int({ min: 1, max: 20 });
    const price = faker.number.int({ min: 1000, max: 50000 });
    return {
      description: faker.commerce.productName(),
      id: faker.string.uuid(),
      lineTotal: quantity * price,
      price,
      quantity,
    };
  });
  const subTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const discount = 0;
  const tax =
    taxType === "fixed"
      ? faker.number.int({ max: 10000, min: 0 })
      : subTotal * (faker.number.float({ fractionDigits: 2, max: 7.5, min: 0 }) / 100);
  const total = subTotal - discount + tax;

  return {
    createdAt: addDays(new Date(), -2),
    currency: "NGN",
    customer: customer,
    dateDue: addDays(new Date(), 5),
    dateIssued: new Date(),
    discount: discount,
    discountType: "percentage",
    id: faker.string.uuid(),
    items: items,
    tax: tax,
    taxType: taxType,
    note: "",
    status: status,
    subTotal: subTotal,
    title: `Invoice for ${customer.name}`,
    total: total,
    updatedAt: new Date(),
  };
});

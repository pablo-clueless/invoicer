"use client";

import { RiDeleteBin4Line } from "@remixicon/react";
import { subDays } from "date-fns";
import { toast } from "sonner";
import React from "react";

import type { DiscountType, InvoiceDto, InvoiceItemDto } from "@/types";
import { DatePicker, Select } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CURRENCIES } from "@/constants";
import { formatCurrency } from "@/lib";

import { MOCK_CUSTOMERS } from "@/__mock__";

const DISCOUNT_TYPES = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

const initialValues: InvoiceDto = {
  currency: "NGN",
  customer: null,
  customerId: "",
  dateDue: new Date(),
  dateIssued: new Date(),
  discount: 0,
  discountType: "fixed",
  items: [],
  note: "",
  subTotal: 0,
  tax: 0,
  taxType: "fixed",
  title: "",
  total: 0,
};

const Page = () => {
  const initialItems: InvoiceItemDto = {
    description: "",
    lineTotal: 0,
    price: 0,
    quantity: 0,
  };

  const [items, setItems] = React.useState<InvoiceItemDto[]>([initialItems]);

  const addItem = () => {
    setItems((prev) => [...prev, initialItems]);
  };

  const updateItem = (index: number, values: InvoiceItemDto) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...values } : item)));
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      toast.error("At least one item is required");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [newInvoice, setNewInvoice] = React.useState<InvoiceDto>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewInvoice((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setFieldValue = React.useCallback(<K extends keyof InvoiceDto>(field: K, value: InvoiceDto[K]) => {
    setNewInvoice((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveDraft = async () => {};

  const handleSubmit = async () => {
    if (!newInvoice.customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!newInvoice.title) {
      toast.error("Please enter a title");
      return;
    }
    if (!newInvoice.currency) {
      toast.error("Please select a currency");
      return;
    }
    if (!newInvoice.items.length) {
      toast.error("Please add at least one item");
      return;
    }
    items.forEach((item) => {
      if (!item.description || !item.price || !item.quantity) {
        toast.error("Please fill all the fields");
        return;
      }
    });
  };

  React.useEffect(() => {
    const subTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const discount = newInvoice.discountType === "fixed" ? newInvoice.discount : subTotal * (newInvoice.discount / 100);
    const tax = newInvoice.taxType === "fixed" ? newInvoice.tax : subTotal * (newInvoice.tax / 100);
    const total = subTotal - discount + tax;

    setFieldValue("subTotal", subTotal);
    setFieldValue("total", total);
  }, [items, newInvoice.discount, newInvoice.discountType, newInvoice.tax, newInvoice.taxType, setFieldValue]);

  React.useEffect(() => {
    if (newInvoice.customerId) {
      const customer = MOCK_CUSTOMERS.find((customer) => customer.id === newInvoice.customerId);
      if (customer) {
        setFieldValue("customer", customer);
      }
    }
  }, [setFieldValue, newInvoice]);

  return (
    <div className="h-full w-full py-4">
      <div className="container mx-auto h-full max-w-[1200px] space-y-4 overflow-y-auto rounded-md border p-4">
        <h2 className="text-xl font-medium">New Invoice</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <h4 className="font-medium">Customer Information</h4>
              <p className="text-sm text-gray-500"></p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div className="">
                <Select
                  label="Select Customer"
                  onValueChange={(value) => setFieldValue("customerId", value)}
                  options={MOCK_CUSTOMERS.map((customer) => ({ label: customer.name, value: customer.id }))}
                  value={newInvoice.customerId}
                />
              </div>
              <Input className="lowercase" label="Customer Email" readOnly value={newInvoice.customer?.email} />
            </div>
          </div>
          <hr />
          <div className="space-y-2">
            <div>
              <h4 className="font-medium">Invoice Details</h4>
              <p className="text-sm text-gray-500"></p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <Input label="Invoice Title" name="title" onChange={handleChange} />
              <Select
                label="Currency"
                onValueChange={(value) => setFieldValue("currency", value)}
                options={CURRENCIES}
                value={newInvoice.currency}
              />
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <DatePicker
                  minDate={subDays(new Date(), 1)}
                  onSelect={(value) => setFieldValue("dateDue", value)}
                  selected={newInvoice.dateDue}
                />
              </div>
            </div>
            <div className="space-y-2 py-4">
              <p className="text-lg font-medium text-gray-700">Invoice Items</p>
              {items.map((item, index) => (
                <div className="grid grid-cols-12 gap-x-4" key={index}>
                  <Input
                    label="Description"
                    onChange={(e) => updateItem(index, { ...item, description: e.target.value })}
                    value={item.description}
                    wrapperClassName="col-span-6"
                  />
                  <Input
                    label="Quantity"
                    onChange={(e) => updateItem(index, { ...item, quantity: Number(e.target.value) })}
                    value={item.quantity}
                  />
                  <Input
                    label="Unit Price"
                    onChange={(e) => updateItem(index, { ...item, price: Number(e.target.value) })}
                    value={item.price}
                    wrapperClassName="col-span-2"
                  />
                  <Input label="Line Total" readOnly value={item.quantity * item.price} wrapperClassName="col-span-2" />
                  <div className="grid place-items-center">
                    <button onClick={() => removeItem(index)}>
                      <RiDeleteBin4Line className="size-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              <Button onClick={addItem} size="sm" variant="outline">
                Add Item
              </Button>
              <div className="flex flex-col items-end gap-y-1">
                <div className="grid h-9 w-2/5 grid-cols-3 gap-x-4">
                  <p>Subtotal:</p>
                  <p className="col-span-2 text-right font-bold">
                    {formatCurrency(newInvoice.subTotal, newInvoice.currency)}
                  </p>
                </div>
                <hr />
                <div className="grid w-2/5 grid-cols-3 gap-x-4">
                  <p>Discount:</p>
                  <Select
                    onValueChange={(value) => setFieldValue("discountType", value as DiscountType)}
                    options={DISCOUNT_TYPES}
                    value={newInvoice.discountType}
                  />
                  <Input className="text-right" name="discount" onChange={handleChange} />
                </div>
                <hr />
                <div className="grid w-2/5 grid-cols-3 gap-x-4">
                  <p>Tax:</p>
                  <Select
                    onValueChange={(value) => setFieldValue("taxType", value as DiscountType)}
                    options={DISCOUNT_TYPES}
                    value={newInvoice.taxType}
                  />
                  <Input className="text-right" name="tax" onChange={handleChange} />
                </div>
                <div className="grid h-9 w-2/5 grid-cols-3 gap-x-4">
                  <p className="text-xl font-bold">Total:</p>
                  <p className="col-span-2 text-right text-xl font-bold">
                    {formatCurrency(newInvoice.total, newInvoice.currency)}
                  </p>
                </div>
              </div>
            </div>
            <Textarea label="Notes" name="notes" onChange={handleChange} />
          </div>
          <hr />
          <div className="flex items-center justify-between">
            <Button variant="ghost">Cancel</Button>
            <div className="flex items-center gap-x-5">
              <Button onClick={handleSaveDraft} variant="outline">
                Save Draft
              </Button>
              <Button onClick={handleSubmit} type="submit">
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

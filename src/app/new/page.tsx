"use client";

import { useFormik } from "formik";
import React from "react";

import type { InvoiceDto, InvoiceItemProps, InvoiceProps } from "@/types";
import { DatePicker, Select } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CURRENCIES } from "@/constants";
import { generateUUID } from "@/lib";

const Page = () => {
  const id = React.useMemo(() => generateUUID(), []);

  const initialItems: InvoiceItemProps = {
    description: "",
    id,
    lineTotal: 0,
    price: 0,
    quantity: 0,
  };

  const [items, setItems] = React.useState<InvoiceItemProps[]>([initialItems]);

  const addItem = () => {
    setItems((prev) => [...prev, initialItems]);
  };

  const updateItem = (id: string, values: InvoiceItemProps) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...values } : item)));
  };

  const { handleChange, setFieldValue, values } = useFormik<InvoiceDto>({
    initialValues: {
      companyLogo: "",
      companyName: "",
      currency: "",
      customerId: "",
      dateDue: new Date(),
      dateIssued: new Date(),
      discount: 0,
      discountType: "fixed",
      items: items,
      note: "",
      subTotal: 0,
      tax: 0,
      taxType: "fixed",
      title: "",
      total: 0,
    },
    onSubmit: () => {},
  });

  return (
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
                options={[]}
                value={values.customerId}
              />
            </div>
            <Input label="Customer Email" readOnly />
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
              value={values.currency}
            />
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <DatePicker onSelect={() => {}} selected={new Date()} />
            </div>
          </div>
          <div className="space-y-2 py-4">
            <p className="text-lg font-medium text-gray-700">Invoice Items</p>
            {items.map((item) => (
              <div className="grid grid-cols-10 gap-x-4" key={item.id}>
                <Input
                  label="Description"
                  onChange={(e) => updateItem(item.id, { ...item, description: e.target.value })}
                  value={item.description}
                  wrapperClassName="col-span-5"
                />
                <Input
                  label="Quantity"
                  onChange={(e) => updateItem(item.id, { ...item, quantity: Number(e.target.value) })}
                  value={item.quantity}
                />
                <Input
                  label="Unit Price"
                  onChange={(e) => updateItem(item.id, { ...item, price: Number(e.target.value) })}
                  value={item.price}
                  wrapperClassName="col-span-2"
                />
                <Input label="Line Total" readOnly value={item.quantity * item.price} wrapperClassName="col-span-2" />
              </div>
            ))}
            <Button onClick={addItem} size="sm" variant="outline">
              Add Item
            </Button>
            <div className="flex flex-col items-end gap-y-1">
              <div className="w-2/5">
                <p>Subtotal:</p>
              </div>
              <hr />
              <div className="grid w-2/5 grid-cols-3 gap-x-4">
                <p>Discount:</p>
                <Input name="discount" />
                <Select
                  onValueChange={(value) => setFieldValue("discountType", value)}
                  options={[]}
                  value={values.discountType}
                />
              </div>
              <hr />
              <div className="grid w-2/5 grid-cols-3 gap-x-4">
                <p>Tax:</p>
                <Input name="tax" />
                <Select
                  onValueChange={(value) => setFieldValue("taxType", value)}
                  options={[]}
                  value={values.taxType}
                />
              </div>
            </div>
          </div>
          <Textarea label="Notes" name="notes" onChange={handleChange} />
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Page;

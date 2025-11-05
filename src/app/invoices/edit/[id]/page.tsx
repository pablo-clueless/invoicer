"use client";

import { useParams, useRouter } from "next/navigation";
import { RiDeleteBin4Line } from "@remixicon/react";
import { subDays } from "date-fns";
import { toast } from "sonner";
import React from "react";

import type { DiscountType, HttpError, InvoiceItemDto, InvoiceStatus, UpdateInvoiceDto } from "@/types";
import { useGetInvoiceQuery, useUpdateInvoiceMutation } from "@/api/invoice/api";
import { Breadcrumb, DatePicker, Loader, Select } from "@/components/shared";
import { useGetCustomersQuery } from "@/api/customer/api";
import { AddCustomer } from "@/components/add-customer";
import { Textarea } from "@/components/ui/textarea";
import { WithAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INVOICE_STATUSES } from "@/config";
import { CURRENCIES } from "@/constants";
import { formatCurrency } from "@/lib";

const DISCOUNT_TYPES = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: invoice, isFetching } = useGetInvoiceQuery(id, { skip: !id, refetchOnMountOrArgChange: true });

  const initialValues: UpdateInvoiceDto = {
    currency: invoice?.data.currency || "NGN",
    customerId: invoice?.data.customer.id || "",
    dateDue: invoice?.data.dateDue || new Date(),
    discount: invoice?.data.discount || 0,
    discountType: invoice?.data.discountType || "fixed",
    items:
      invoice?.data.items.map((item) => ({
        description: item.description,
        lineTotal: item.lineTotal,
        price: item.price,
        quantity: item.quantity,
      })) || [],
    note: invoice?.data.note || "",
    status: invoice?.data.status || "pending",
    tax: invoice?.data.tax || 0,
    taxType: invoice?.data.taxType || "fixed",
    title: invoice?.data.title || "",
  };

  const initialItems = React.useMemo((): InvoiceItemDto[] => {
    if (!invoice) return [];
    return invoice.data.items.map((item) => ({
      description: item.description,
      lineTotal: item.lineTotal,
      price: item.price,
      quantity: item.quantity,
    }));
  }, [invoice]);

  const [items, setItems] = React.useState<InvoiceItemDto[]>(initialItems);

  const addItem = () => {
    const newItem: InvoiceItemDto = { description: "", lineTotal: 0, price: 0, quantity: 0 };
    setItems((prev) => [...prev, newItem]);
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

  const [newInvoice, setNewInvoice] = React.useState<UpdateInvoiceDto>(initialValues);

  const [updateInvoice, { isLoading }] = useUpdateInvoiceMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewInvoice((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setFieldValue = React.useCallback(<K extends keyof UpdateInvoiceDto>(field: K, value: UpdateInvoiceDto[K]) => {
    setNewInvoice((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    const payload: UpdateInvoiceDto = {
      ...newInvoice,
      discount: Number(newInvoice.discount),
      tax: Number(newInvoice.tax),
      items,
    };
    updateInvoice({ id, payload })
      .unwrap()
      .then((response) => {
        const message = response.message || "";
        toast.success(message);
        router.push("/");
      })
      .catch((error) => {
        const message = (error as HttpError).data.message || "Error creating invoice";
        toast.error(message);
      });
  };

  const { subTotal, total } = React.useMemo(() => {
    const subTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const discount = newInvoice.discountType === "fixed" ? newInvoice.discount : subTotal * (newInvoice.discount / 100);
    const tax = newInvoice.taxType === "fixed" ? newInvoice.tax : subTotal * (newInvoice.tax / 100);
    const total = subTotal - discount + tax;

    return { subTotal, total };
  }, [items, newInvoice.discount, newInvoice.discountType, newInvoice.tax, newInvoice.taxType]);

  const { data: customers } = useGetCustomersQuery(
    { page: 1, query: "", size: 20 },
    { refetchOnMountOrArgChange: true },
  );

  const customer = React.useMemo(() => {
    if (!newInvoice.customerId) return null;
    if (!customers?.data?.items?.length) return null;
    const customer = customers.data.items.find((customer) => customer.id === newInvoice.customerId);
    if (!customer) return null;
    return customer;
  }, [customers, newInvoice.customerId]);

  if (isFetching)
    <div className="grid h-full w-full place-items-center py-4">
      <Loader />
    </div>;

  return (
    <WithAuth>
      <div className="h-full w-full py-4">
        <div className="container mx-auto h-full max-w-[1200px] space-y-4 overflow-y-auto rounded-md border p-4">
          <Breadcrumb
            items={[
              { label: "Invoices", href: "" },
              { label: "New Invoice", href: `"/invoices/edit/${invoice}` },
            ]}
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">Customer Information</h4>
                <p className="text-sm text-gray-500"></p>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <div className="flex items-end gap-x-1">
                  <Select
                    className="rounded-r-none"
                    label="Select Customer"
                    onValueChange={(value) => setFieldValue("customerId", value)}
                    options={(customers?.data.items || []).map((customer) => ({
                      label: customer.name,
                      value: customer.id,
                    }))}
                    value={newInvoice.customerId}
                  />
                  <AddCustomer size="sm" />
                </div>
                <Input className="lowercase" label="Customer Email" readOnly value={customer?.email} />
                <Input className="lowercase" label="Customer Phone" readOnly value={customer?.phone} />
              </div>
            </div>
            <hr />
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">Invoice Details</h4>
                <p className="text-sm text-gray-500"></p>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <Input label="Invoice Title" name="title" onChange={handleChange} value={newInvoice.title} />
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
                <Select
                  label="Status"
                  onValueChange={(value) => setFieldValue("status", value as InvoiceStatus)}
                  options={INVOICE_STATUSES}
                  value={newInvoice.status}
                />
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
                    <Input
                      label="Line Total"
                      readOnly
                      value={item.quantity * item.price}
                      wrapperClassName="col-span-2"
                    />
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
                    <p className="col-span-2 text-right font-bold">{formatCurrency(subTotal, newInvoice.currency)}</p>
                  </div>
                  <hr />
                  <div className="grid w-2/5 grid-cols-3 gap-x-4">
                    <p>Discount:</p>
                    <Select
                      onValueChange={(value) => setFieldValue("discountType", value as DiscountType)}
                      options={DISCOUNT_TYPES}
                      value={newInvoice.discountType}
                    />
                    <Input className="text-right" name="discount" onChange={handleChange} type="number" />
                  </div>
                  <hr />
                  <div className="grid w-2/5 grid-cols-3 gap-x-4">
                    <p>Tax:</p>
                    <Select
                      onValueChange={(value) => setFieldValue("taxType", value as DiscountType)}
                      options={DISCOUNT_TYPES}
                      value={newInvoice.taxType}
                    />
                    <Input className="text-right" name="tax" onChange={handleChange} type="number" />
                  </div>
                  <div className="grid h-9 w-2/5 grid-cols-3 gap-x-4">
                    <p className="text-xl font-bold">Total:</p>
                    <p className="col-span-2 text-right text-xl font-bold">
                      {formatCurrency(total, newInvoice.currency)}
                    </p>
                  </div>
                </div>
              </div>
              <Textarea label="Notes" name="note" onChange={handleChange} value={newInvoice.note} />
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <Button disabled={isLoading} variant="ghost">
                Cancel
              </Button>
              <div className="flex items-center gap-x-5">
                <Button disabled={isLoading} onClick={handleSubmit} type="submit">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WithAuth>
  );
};

export default Page;

"use client";

import { RiReceiptLine } from "@remixicon/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserStore } from "@/store/core/user";
import { cn, formatCurrency } from "@/lib";
import { INVOICE_STATUS } from "@/config";

import { MOCK_INVOICES } from "@/__mock__";

const Page = () => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const id = useParams().id as string;
  const { user } = useUserStore();

  const invoice = MOCK_INVOICES.find((invoice) => invoice.id === id);

  if (!invoice) {
    return (
      <div className="h-full w-full py-4">
        <div className="container mx-auto grid h-full max-w-[1200px] place-items-center space-y-4 overflow-y-auto rounded-md border p-4">
          <h2 className="text-xl font-medium">Invoice not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full py-4" ref={contentRef}>
      <div className="container mx-auto h-full max-w-[1200px] space-y-4 overflow-y-auto rounded-md border p-4">
        <div></div>
        <div>
          <h2 className="text-xl font-medium">{invoice.title}</h2>
          <div className="flex items-center gap-x-3">
            <p className="text-xs text-gray-500 uppercase">{`INVOICE-${invoice.id.split("-")[0]}`}</p>
            <p className="size-1 rounded-full bg-gray-500"></p>
            <p className={cn("rounded px-2 py-1 text-xs capitalize", INVOICE_STATUS[invoice.status])}>
              {invoice.status}
            </p>
          </div>
        </div>
        <div className="w-full space-y-1 rounded-md border bg-white p-4">
          <div>
            <p className="text-sm font-medium">Amount Due</p>
            <h4 className="text-primary-500 text-2xl font-bold">{formatCurrency(invoice.total, invoice.currency)}</h4>
          </div>
          <hr />
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-x-5">
              <div>
                <p className="text-sm font-medium">Issued Date</p>
                <p className="text-sm text-gray-500">{format(new Date(invoice.dateIssued), "PP")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-gray-500">{format(new Date(invoice.dateDue), "PP")}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Invoice For</p>
              <div>
                <div className="flex items-center gap-x-2">
                  <div className="bg-primary-100/50 grid size-10 place-items-center rounded-full">
                    <RiReceiptLine className="text-primary-500 size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{invoice.customer.name}</h4>
                    <p className="text-xs text-gray-500 lowercase">{invoice.customer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Items</h4>
          <div className="w-full rounded-md border bg-white p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-left">
                      <div>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price, invoice.currency)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.quantity * item.price, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Notes</h4>
          <div className="w-full rounded-md border bg-white p-4">
            {invoice.note ? (
              <p className="text-sm text-gray-700">{invoice.note}</p>
            ) : (
              <p className="text-sm text-gray-400">No notes added</p>
            )}
          </div>
        </div>
        <div className="bg-primary-100 w-full rounded-md border p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Subtotal</p>
              <p className="text-sm">{formatCurrency(invoice.subTotal, invoice.currency)}</p>
            </div>
            {invoice.discount > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Discount {invoice.discountType === "percentage" ? "(%)" : ""}</p>
                <p className="text-sm">
                  -
                  {invoice.discountType === "percentage"
                    ? `${invoice.discount}%`
                    : formatCurrency(invoice.discount, invoice.currency)}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Tax {invoice.taxType === "percentage" ? "(%)" : ""}</p>
              <p className="text-sm">
                {invoice.taxType === "percentage" ? `${invoice.tax}%` : formatCurrency(invoice.tax, invoice.currency)}
              </p>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">{formatCurrency(invoice.total, invoice.currency)}</p>
            </div>
          </div>
        </div>
        <div className="w-full rounded-md border bg-gray-200 p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Payment Details</h4>
            <div>
              <h4 className="font-bold">{user?.bankInformation.bankName || "Sterling Bank Plc"}</h4>
              <p className="text-sm text-gray-600">{user?.bankInformation.accountName || "Inclusion Software"}</p>
              <p className="text-sm text-gray-600">{user?.bankInformation.accountNumber || "0098463874"}</p>
              <p className="text-sm text-gray-600">{user?.bankInformation.bankSwiftCode || "XX"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

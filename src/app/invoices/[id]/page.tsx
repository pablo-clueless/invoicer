"use client";

import { RiLoaderLine, RiReceiptLine } from "@remixicon/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoicePrintable } from "@/components/invoice-printable";
import { DeleteInvoice } from "@/components/delete-invoice";
import { useGetInvoiceQuery } from "@/api/invoice/api";
import { WithAuth } from "@/components/providers";
import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib";
import { INVOICE_STATUS } from "@/config";
import Link from "next/link";

const Page = () => {
  const [showPreview, setShowPreview] = React.useState(false);
  const id = useParams().id as string;

  const { data: invoice, isFetching } = useGetInvoiceQuery(id, { skip: !id, refetchOnMountOrArgChange: true });

  if (isFetching) {
    return (
      <div className="h-full w-full py-4">
        <div className="container mx-auto grid h-full max-w-[1200px] place-items-center space-y-4 overflow-y-auto rounded-md border p-4">
          <RiLoaderLine className="text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }

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
    <WithAuth>
      {showPreview ? (
        <InvoicePrintable invoice={invoice.data} onClosePrint={() => setShowPreview(false)} />
      ) : (
        <div className="h-full w-full py-4">
          <div className="container mx-auto h-full max-w-[1200px] space-y-4 overflow-y-auto rounded-md border p-4">
            <Breadcrumb
              items={[
                { label: "Invoices", href: "" },
                { label: `INV-${invoice.data.referenceNo}`, href: `/invoices/${invoice.data.id}` },
              ]}
            />
            <div className="flex w-full items-center justify-between">
              <div>
                <h2 className="text-xl font-medium">{invoice.data.title}</h2>
                <div className="flex items-center gap-x-3">
                  <p className="text-xs text-gray-500 uppercase">{`INVOICE-${invoice.data.referenceNo}`}</p>
                  <p className="size-1 rounded-full bg-gray-500"></p>
                  <p className={cn("rounded px-2 py-1 text-xs capitalize", INVOICE_STATUS[invoice.data.status])}>
                    {invoice.data.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-5">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/invoices/edit/${invoice.data.id}`}>Edit Invoice</Link>
                </Button>
                <DeleteInvoice invoiceId={invoice.data.id} />
                <Button onClick={() => setShowPreview(true)} size="sm">
                  Print
                </Button>
              </div>
            </div>
            <div className="w-full space-y-1 rounded-md border bg-white p-4">
              <div>
                <p className="text-sm font-medium">Amount Due</p>
                <h4 className="text-primary-500 text-2xl font-bold">
                  {formatCurrency(invoice.data.total, invoice.data.currency)}
                </h4>
              </div>
              <hr />
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-x-5">
                  <div>
                    <p className="text-sm font-medium">Issued Date</p>
                    <p className="text-sm text-gray-500">{format(new Date(invoice.data.dateIssued), "PP")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-gray-500">{format(new Date(invoice.data.dateDue), "PP")}</p>
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
                        <h4 className="text-sm font-bold">{invoice.data.customer.name}</h4>
                        <p className="text-xs text-gray-500 lowercase">{invoice.data.customer.email}</p>
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
                    {invoice.data.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-left">
                          <div>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.price, invoice.data.currency)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.quantity * item.price, invoice.data.currency)}
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
                {invoice.data.note ? (
                  <p className="text-sm text-gray-700">{invoice.data.note}</p>
                ) : (
                  <p className="text-sm text-gray-400">No notes added</p>
                )}
              </div>
            </div>
            <div className="bg-primary-100 w-full rounded-md border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Subtotal</p>
                  <p className="text-sm">{formatCurrency(invoice.data.subTotal, invoice.data.currency)}</p>
                </div>
                {invoice.data.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Discount {invoice.data.discountType === "percentage" ? "(%)" : ""}
                    </p>
                    <p className="text-sm">
                      -
                      {invoice.data.discountType === "percentage"
                        ? `${invoice.data.discount}%`
                        : formatCurrency(invoice.data.discount, invoice.data.currency)}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Tax {invoice.data.taxType === "percentage" ? "(%)" : ""}</p>
                  <p className="text-sm">
                    {invoice.data.taxType === "percentage"
                      ? `${invoice.data.tax}%`
                      : formatCurrency(invoice.data.tax, invoice.data.currency)}
                  </p>
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(invoice.data.total, invoice.data.currency)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </WithAuth>
  );
};

export default Page;

"use client";

import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import Image from "next/image";

import type { InvoiceProps } from "@/types";
import { useAppSelector } from "@/hooks";
import { formatCurrency } from "@/lib";
import { Button } from "./ui/button";
import React from "react";

interface Props {
  invoice: InvoiceProps;
  onClosePrint: () => void;
}

export const InvoicePrintable = ({ invoice, onClosePrint }: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const discountAmount =
    invoice.discountType === "percentage" ? (invoice.subTotal * invoice.discount) / 100 : invoice.discount;

  const taxableAmount = invoice.subTotal - discountAmount;

  const taxAmount = invoice.taxType === "percentage" ? (taxableAmount * invoice.tax) / 100 : invoice.tax;

  const computedTotal = taxableAmount + taxAmount;

  return (
    <div className="h-full w-full py-4">
      <div className="container mx-auto h-full max-w-[1200px] space-y-6 overflow-y-auto">
        <div className="flex w-full items-center justify-end gap-x-5">
          <Button onClick={onClosePrint} size="sm" variant="outline">
            Back
          </Button>
          <Button onClick={handlePrint} size="sm">
            Print
          </Button>
        </div>
        <div className="h-full w-full overflow-y-auto bg-white p-8 print:p-4" ref={contentRef}>
          <div className="mb-8 flex items-start justify-between border-b-2 border-gray-200 pb-6">
            <div>
              <div className="relative aspect-square size-24">
                <Image
                  src={user?.companyLogo || "/assets/images/logo.jpg"}
                  alt={user?.companyName || "Studio 1203"}
                  fill
                  sizes="100"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.companyName || "Studio 1203"}</h1>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p className="font-fira-code">Email: {user?.email || "invoices@studio1203.co"}</p>
                <p className="font-fira-code">Phone: {user?.phone || "+2349098897665"}</p>
                <div className="flex items-center gap-x-5">
                  <p className="font-fira-code">Tax ID: {user?.taxId || "93600093201"}</p>
                  <p className="font-fira-code">RC Number: {user?.rcNumber || "36000932-0001/01"}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-4 text-4xl font-bold text-blue-600">INVOICE</div>
              <div className="space-y-1 text-sm font-medium text-gray-700">
                <p className="font-fira-code">Invoice #: {`INV-${invoice.referenceNo}`}</p>
                <p className="font-fira-code">Date Issued: {format(new Date(invoice.dateIssued), "MMM dd, yyyy")}</p>
                <p className="font-fira-code">Due Date: {format(new Date(invoice.dateDue), "MMM dd, yyyy")}</p>
              </div>
            </div>
          </div>
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="mb-3 font-semibold text-gray-900">BILL TO:</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-fira-code font-medium">{invoice.customer.name}</p>
                <p className="font-fira-code">{invoice.customer.email}</p>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div
                className={`rounded-lg px-6 py-3 text-sm font-bold uppercase ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : invoice.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {invoice.status}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Unit Price</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-4">
                      <p className="font-fira-code text-sm text-gray-600">{item.description}</p>
                    </td>
                    <td className="font-fira-code px-4 py-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="font-fira-code px-4 py-4 text-right text-gray-700">
                      {formatCurrency(item.price, invoice.currency)}
                    </td>
                    <td className="font-fira-code px-4 py-4 text-right font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.price, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-8 grid grid-cols-3 gap-8">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">NOTES:</h3>
              <p className="font-fira-code text-sm text-gray-700">{invoice.note || "No additional notes"}</p>
            </div>
            <div></div>
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-fira-code font-medium text-gray-900">
                  {formatCurrency(invoice.subTotal, invoice.currency)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Discount {invoice.discountType === "percentage" ? `(${invoice.discount.toFixed(2)}%)` : ""}:
                  </span>
                  <span className="font-fira-code font-medium text-gray-900">
                    -{formatCurrency(discountAmount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">
                  Tax {invoice.taxType === "percentage" ? `(${invoice.tax.toFixed(2)}%)` : ""}:
                </span>
                <span className="font-fira-code font-medium text-gray-900">
                  {formatCurrency(taxAmount, invoice.currency)}
                </span>
              </div>
              <div className="border-t-2 border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Due:</span>
                  <span className="font-fira-code text-2xl font-bold text-blue-600">
                    {formatCurrency(computedTotal, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-gray-300 pt-8">
            <h3 className="mb-4 text-lg font-bold text-gray-900">PAYMENT DETAILS</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Bank Name:</p>
                  <p className="font-fira-code text-gray-700">
                    {user?.bankInformation.bankName || "Replica Bank Ltd."}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Account Name:</p>
                  <p className="font-fira-code text-gray-700">
                    {user?.bankInformation.accountName || "Replica Technologies Ltd."}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Account Number:</p>
                  <p className="font-fira-code text-gray-700">{user?.bankInformation.accountNumber || "1234567890"}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Routing Number:</p>
                  <p className="font-fira-code text-gray-700">{user?.bankInformation.routingNumber || "021000021"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">SWIFT Code:</p>
                  <p className="font-fira-code text-gray-700">{user?.bankInformation.bankSwiftCode || "REPLNGLA"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">IBAN:</p>
                  <p className="font-fira-code text-gray-700">
                    {user?.bankInformation.iban || "NG12REPL12345678901234567"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-600">
            <p className="font-fira-code">
              Thank you for your business! For questions, please contact {user?.email || "enquiries@studio1203.co"}
            </p>
            <p className="mt-1">{user?.website || "https://studio1203.co"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

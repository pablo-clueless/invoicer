import { RiReceiptLine } from "@remixicon/react";
import { format } from "date-fns";
import Link from "next/link";

import type { InvoiceProps } from "@/types";
import { INVOICE_STATUS } from "@/config";
import { cn, formatCurrency } from "@/lib";

interface Props {
  invoice: InvoiceProps;
}

export const Invoice = ({ invoice }: Props) => {
  const status = INVOICE_STATUS[invoice.status];

  return (
    <Link
      className="hover:border-primary-500 flex items-center gap-x-4 rounded-md border p-4"
      href={`/invoices/${invoice.id}`}
    >
      <div className="bg-primary-500/25 grid size-10 place-items-center rounded-full">
        <RiReceiptLine className="text-primary-500 size-4" />
      </div>
      <div className="flex-1">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{invoice.title}</h4>
          <p className="text-sm font-bold text-gray-500">{formatCurrency(invoice.total, invoice.currency)}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-4">
            <p className="text-xs text-gray-500 uppercase">{`INVOICE-${invoice.id.split("-")[0]}`}</p>
            <p className="size-1 rounded-full bg-gray-500"></p>
            <p className="text-xs text-gray-500">{format(invoice.dateDue, "dd/MM/yyyy")}</p>
          </div>
          <p className={cn("rounded px-2 py-1 text-xs capitalize", status)}>{invoice.status}</p>
        </div>
      </div>
    </Link>
  );
};

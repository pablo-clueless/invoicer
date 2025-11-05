import React from "react";

import { Pagination, ScrollArea, TabPanel } from "./shared";
import { useGetInvoicesQuery } from "@/api/invoice/api";
import { Invoice } from "./invoice";

interface Props {
  query: string;
  selected: string;
}

export const Invoices = ({ query, selected }: Props) => {
  const [page, setPage] = React.useState(1);

  const { data: invoices } = useGetInvoicesQuery({ page, query, size: 10 }, { refetchOnMountOrArgChange: true });

  return (
    <TabPanel selected={selected} value="invoices">
      <div className="h-full w-full">
        {!invoices?.data.items.length ? (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-gray-500">No invoices</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full space-y-2">
            {invoices.data.items.map((invoice) => (
              <Invoice invoice={invoice} key={invoice.id} />
            ))}
            <Pagination current={page} limit={10} onPageChange={setPage} total={invoices.data.total_items} />
          </ScrollArea>
        )}
      </div>
    </TabPanel>
  );
};

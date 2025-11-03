import type { InvoiceProps } from "@/types";
import { ScrollArea, TabPanel } from "./shared";

interface Props {
  selected: string;
}

export const Invoices = ({ selected }: Props) => {
  const invoices: InvoiceProps[] = [];

  return (
    <TabPanel selected={selected} value="invoices">
      <div className="h-full w-full">
        {!invoices.length ? (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-gray-500">No invoices</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            {invoices.map((invoice) => (
              <div className="" key={invoice.id}></div>
            ))}
          </ScrollArea>
        )}
      </div>
    </TabPanel>
  );
};

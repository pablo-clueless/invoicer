import { ScrollArea, TabPanel } from "./shared";

import { Invoice } from "./invoice";

import { MOCK_INVOICES } from "@/__mock__";

interface Props {
  selected: string;
}

export const Invoices = ({ selected }: Props) => {
  return (
    <TabPanel selected={selected} value="invoices">
      <div className="h-full w-full">
        {!MOCK_INVOICES.length ? (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-gray-500">No invoices</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full space-y-2">
            {MOCK_INVOICES.map((invoice) => (
              <Invoice invoice={invoice} key={invoice.id} />
            ))}
          </ScrollArea>
        )}
      </div>
    </TabPanel>
  );
};

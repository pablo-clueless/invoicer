import { ScrollArea, TabPanel } from "./shared";
import { Customer } from "./customer";

import { MOCK_CUSTOMERS } from "@/__mock__";

interface Props {
  selected: string;
}

export const Customers = ({ selected }: Props) => {
  const handleDeleteCustomer = (id: string) => {
    MOCK_CUSTOMERS.filter((customer) => customer.id !== id);
  };

  return (
    <TabPanel selected={selected} value="customers">
      <div className="h-full w-full">
        {!MOCK_CUSTOMERS.length ? (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-gray-500">No customers</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full space-y-4">
            {MOCK_CUSTOMERS.map((customer) => (
              <Customer customer={customer} key={customer.id} onDeleteCustomer={handleDeleteCustomer} />
            ))}
          </ScrollArea>
        )}
      </div>
    </TabPanel>
  );
};

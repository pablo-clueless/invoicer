import type { CustomerProps } from "@/types";
import { ScrollArea, TabPanel } from "./shared";

interface Props {
  selected: string;
}

export const Customers = ({ selected }: Props) => {
  const customers: CustomerProps[] = [];

  return (
    <TabPanel selected={selected} value="customers">
      <div className="h-full w-full">
        {!customers.length ? (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-gray-500">No customers</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            {customers.map((customer) => (
              <div className="" key={customer.id}></div>
            ))}
          </ScrollArea>
        )}
      </div>
    </TabPanel>
  );
};

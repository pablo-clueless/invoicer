import { toast } from "sonner";
import React from "react";

import { useDeleteCustomerMutation, useGetCustomersQuery } from "@/api/customer/api";
import { Pagination, ScrollArea, TabPanel } from "./shared";
import type { HttpError } from "@/types";
import { Customer } from "./customer";

interface Props {
  query: string;
  selected: string;
}

export const Customers = ({ query, selected }: Props) => {
  const [page, setPage] = React.useState(1);

  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id)
      .unwrap()
      .then((response) => {
        const message = response.message || "";
        toast.success(message);
      })
      .catch((error) => {
        const message = (error as HttpError).data.message || "";
        toast.error(message);
      });
  };

  const { data: customers } = useGetCustomersQuery({ page, query, size: 10 }, { refetchOnMountOrArgChange: true });

  return (
    <TabPanel selected={selected} value="customers">
      <div className="h-full w-full">
        {!customers?.data.items.length ? (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-gray-500">No customers</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full space-y-4">
            {customers.data.items.map((customer) => (
              <Customer
                customer={customer}
                isDeleting={isLoading}
                key={customer.id}
                onDeleteCustomer={handleDeleteCustomer}
              />
            ))}
            <Pagination current={page} limit={10} onPageChange={setPage} total={customers.data.total_items} />
          </ScrollArea>
        )}
      </div>
    </TabPanel>
  );
};

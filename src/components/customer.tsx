import { RiDeleteBin4Line, RiLoaderLine } from "@remixicon/react";
import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { CustomerProps } from "@/types";
import { Button } from "./ui/button";

interface Props {
  customer: CustomerProps;
  isDeleting: boolean;
  onDeleteCustomer: (id: string) => void;
}

export const Customer = ({ customer, isDeleting, onDeleteCustomer }: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full items-center justify-between rounded-md border p-4">
      <div className="flex items-center gap-x-2">
        <Avatar className="size-10">
          <AvatarFallback className="bg-gray-300"></AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-sm font-bold">{customer.name}</h4>
          <p className="text-xs text-gray-500 lowercase">{customer.email}</p>
        </div>
      </div>
      <Dialog onOpenChange={(open) => !isDeleting && setOpen(open)} open={open}>
        <DialogTrigger asChild>
          <button>
            <RiDeleteBin4Line className="size-4 text-red-500" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this customer? This action is irreversible, be sure before continuing
          </DialogDescription>
          <div className="grid grid-cols-2 gap-x-5">
            <Button disabled={isDeleting} onClick={() => setOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button disabled={isDeleting} onClick={() => onDeleteCustomer(customer.id)} size="sm" variant="destructive">
              {isDeleting ? <RiLoaderLine className="animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

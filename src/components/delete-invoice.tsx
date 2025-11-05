import { RiLoaderLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useDeleteInvoiceMutation } from "@/api/invoice/api";
import type { HttpError } from "@/types";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Props {
  invoiceId: string;
}

export const DeleteInvoice = ({ invoiceId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const [deleteInvoice, { isLoading }] = useDeleteInvoiceMutation();

  const handleDeleteInvoice = () => {
    deleteInvoice(invoiceId)
      .unwrap()
      .then((response) => {
        const message = response.message;
        toast.success(message);
        setOpen(false);
        router.push("/");
      })
      .catch((error) => {
        const message = (error as HttpError).data.message || "";
        toast.error(message);
      });
  };

  return (
    <Dialog onOpenChange={(open) => !isLoading && setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete Invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogDescription>Are you sure you want to delete this invoice?</DialogDescription>
        <div className="grid grid-cols-2 gap-x-5">
          <Button disabled={isLoading} onClick={() => setOpen(false)} size="sm" variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleDeleteInvoice} size="sm" variant="destructive">
            {isLoading ? <RiLoaderLine className="animate-spin" /> : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

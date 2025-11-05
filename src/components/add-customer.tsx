import { RiAddLine, RiLoaderLine } from "@remixicon/react";
import { useFormik } from "formik";
import { toast } from "sonner";
import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useCreateCustomerMutation } from "@/api/customer/api";
import { EMAIL_REGEX, PHONE_REGEX } from "@/config";
import type { CustomerDto, HttpError } from "@/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  size?: "sm" | "lg";
}

const initialValues: CustomerDto = {
  email: "",
  name: "",
  phone: "",
};

export const AddCustomer = ({ size = "lg" }: Props) => {
  const [open, setOpen] = React.useState(false);

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const { errors, handleBlur, handleChange, handleSubmit, resetForm, touched, values } = useFormik<CustomerDto>({
    initialValues,
    validate: (values) => {
      const errors: Partial<Record<keyof CustomerDto, string>> = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email || !EMAIL_REGEX.test(values.email)) errors.email = "Valid email is required";
      if (!values.phone || !PHONE_REGEX.test(values.phone)) errors.phone = "Valid phone is required";
      return errors;
    },
    onSubmit: (values) => {
      createCustomer(values)
        .unwrap()
        .then((response) => {
          const message = response.message || "";
          toast.success(message);
          setOpen(false);
          resetForm({ values: initialValues });
        })
        .catch((error) => {
          const message = (error as HttpError).data.message || "";
          toast.error(message);
        });
    },
  });

  return (
    <Dialog onOpenChange={(open) => !isLoading && setOpen(open)} open={open}>
      <DialogTrigger asChild>
        {size === "sm" ? (
          <button className="hover:border-primary-500 text-primary-500 grid size-9 place-items-center rounded-r-md border">
            <RiAddLine className="size-4" />
          </button>
        ) : (
          <Button size="sm">
            <RiAddLine className="size-4" /> Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogDescription />
        <form className="space-y-2" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={{ message: errors.name, touched: touched.name }}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={{ message: errors.email, touched: touched.email }}
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={{ message: errors.phone, touched: touched.phone }}
          />
          <div className="flex items-center justify-end">
            <Button disabled={isLoading} size="sm" type="submit">
              {isLoading ? <RiLoaderLine className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

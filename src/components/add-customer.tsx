import { useFormik } from "formik";
import { toast } from "sonner";
import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { EMAIL_REGEX, PHONE_REGEX } from "@/config";
import type { CustomerDto } from "@/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const AddCustomer = () => {
  const [open, setOpen] = React.useState(false);

  const { errors, handleBlur, handleChange, handleSubmit, touched, values } = useFormik<CustomerDto>({
    initialValues: {
      email: "",
      name: "",
      phone: "",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof CustomerDto, string>> = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email || !EMAIL_REGEX.test(values.email)) errors.email = "Valid email is required";
      if (!values.phone || !PHONE_REGEX.test(values.phone)) errors.phone = "Valid phone is required";
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
      toast.success("Customer added");
      setOpen(false);
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">Add Customer</Button>
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
            <Button size="sm" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

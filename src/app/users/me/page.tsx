"use client";

import { RiUploadCloud2Line } from "@remixicon/react";
import { useFormik } from "formik";
import { toast } from "sonner";
import Image from "next/image";

import type { HttpError, UpdateUserDto } from "@/types";
import { useUpdateUserMutation } from "@/api/user/api";
import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/api/base/api";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [updateUser, {}] = useUpdateUserMutation();
  const { data: user } = useGetMeQuery(undefined);

  const { handleChange, handleSubmit, setFieldValue, values } = useFormik<UpdateUserDto>({
    enableReinitialize: true,
    initialValues: {
      bankInformation: user?.data.bankInformation || {
        accountName: "",
        accountNumber: "",
        bankName: "",
        bankSwiftCode: "",
        iban: "",
        routingNumber: "",
      },
      companyLogo: null,
      companyName: user?.data.companyName || "",
      email: user?.data.email || "",
      name: user?.data.name || "",
      phone: user?.data.phone || "",
      rcNumber: user?.data.rcNumber || "",
      taxId: user?.data.taxId || "",
      website: user?.data.website || "",
    },
    onSubmit: (values) => {
      updateUser(values)
        .unwrap()
        .then((response) => {
          const message = response.message || "";
          toast.success(message);
        })
        .catch((error) => {
          const message = (error as HttpError).data.message || "";
          toast.error(message);
        });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setFieldValue("companyLogo", file);
  };

  return (
    <div className="h-full w-full py-4">
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto h-full max-w-[1200px] space-y-4 overflow-y-auto rounded-md border p-4">
          <Breadcrumb
            items={[
              { label: "Settings", href: "" },
              { label: `${user?.data.name || "Profile"}`, href: "" },
            ]}
          />
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <Input
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <hr />
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Business Information</h3>
            <div className="space-y-2 md:col-span-2">
              {user?.data.companyLogo ? (
                <Image src={user.data.companyLogo} alt={values.companyName} className="size-20 rounded-full" />
              ) : (
                <label
                  className="bg-primary-100 text-secondary-500 grid size-20 cursor-pointer place-items-center rounded-full"
                  htmlFor="image"
                >
                  <input className="sr-only hidden" id="image" onChange={handleFileUpload} type="file" />
                  <RiUploadCloud2Line />
                </label>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Company Name"
                name="companyName"
                value={values.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
              <Input
                label="Website"
                name="website"
                value={values.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              <Input
                label="RC Number"
                name="rcNumber"
                value={values.rcNumber}
                onChange={handleChange}
                placeholder="Enter registration number"
              />
              <Input
                label="Tax ID"
                name="taxId"
                value={values.taxId}
                onChange={handleChange}
                placeholder="Enter tax identification number"
              />
            </div>
          </div>
          <hr />
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Bank Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Account Name"
                name="bankInformation.accountName"
                value={values.bankInformation.accountName}
                onChange={handleChange}
                placeholder="Enter account name"
              />
              <Input
                label="Account Number"
                name="bankInformation.accountNumber"
                value={values.bankInformation.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
              />
              <Input
                label="Bank Name"
                name="bankInformation.bankName"
                value={values.bankInformation.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
              />
              <Input
                label="Bank Swift Code"
                name="bankInformation.bankSwiftCode"
                value={values.bankInformation.bankSwiftCode}
                onChange={handleChange}
                placeholder="Enter SWIFT code"
              />
              <Input
                label="IBAN"
                name="bankInformation.iban"
                value={values.bankInformation.iban}
                onChange={handleChange}
                placeholder="Enter IBAN"
              />
              <Input
                label="Routing Number"
                name="bankInformation.routingNumber"
                value={values.bankInformation.routingNumber}
                onChange={handleChange}
                placeholder="Enter routing number"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;

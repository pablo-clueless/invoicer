"use client";

import { RiGoogleLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";

const google = `${process.env.NEXT_PUBLIC_BASE_URI}/auth/google`;

const Page = () => {
  return (
    <div className="mx-auto grid h-full max-w-[400px] min-w-[400px] place-items-center">
      <div className="flex w-full flex-col items-center gap-y-6">
        <h2 className="text-xl font-semibold">Welcome</h2>
        <Button onClick={() => window.open(google, "_self")}>
          <RiGoogleLine /> Continue with Google
        </Button>
        <p className="text-center text-xs text-gray-500">
          &copy;{new Date().getFullYear()}. invoicer. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Page;

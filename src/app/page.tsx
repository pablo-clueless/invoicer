"use client";

import Link from "next/link";
import React from "react";

import { AddCustomer } from "@/components/add-customer";
import { Customers } from "@/components/customers";
import { Invoices } from "@/components/invoices";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

const tabs = ["invoices", "customers"];

const Page = () => {
  const [currentTab, setCurrentTab] = React.useState(tabs[0]);

  return (
    <div className="container mx-auto h-full max-w-[1200px] space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {tabs.map((tab) => (
            <button
              className={cn(
                "before:bg-primary-500 relative flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium capitalize before:absolute before:bottom-0 before:h-px before:w-0 before:origin-left before:transition-all before:duration-300 before:ease-in-out",
                currentTab === tab ? "text-primary-500 before:w-full" : "text-gray-500",
              )}
              key={tab}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {currentTab === "invoices" && (
          <div className="flex items-center gap-x-4">
            <Button asChild size="sm">
              <Link href="/new">New Invoice</Link>
            </Button>
          </div>
        )}
        {currentTab === "customers" && (
          <div className="flex items-center gap-x-4">
            <AddCustomer />
          </div>
        )}
      </div>
      <div className="h-[calc(100%-60px)] w-full overflow-hidden">
        <Invoices selected={currentTab} />
        <Customers selected={currentTab} />
      </div>
    </div>
  );
};

export default Page;

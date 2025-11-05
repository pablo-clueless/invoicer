import Link from "next/link";
import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppSelector } from "@/hooks";
import { getInitials } from "@/lib";
import { Button } from "./ui/button";

export const User = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex w-[200px] cursor-pointer items-center gap-x-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary-100 text-secondary-500">{getInitials(user?.name)}</AvatarFallback>
            <AvatarImage src="" />
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold">{user?.name}</h4>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] space-y-1.5 p-2">
        <Link className="hover:bg-primary-100 flex w-full items-start rounded-md px-3 py-1 text-sm" href="/users/me">
          Profile
        </Link>
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <button className="flex w-full items-start rounded-md px-3 py-1 text-sm text-red-500 hover:bg-red-100">
              Logout
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="grid grid-cols-2 gap-x-5">
              <Button onClick={() => setOpen(false)} size="sm" variant="outline">
                Cancel
              </Button>
              <Button onClick={() => {}} size="sm" variant="destructive">
                Logout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

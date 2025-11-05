"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RiLoaderLine } from "@remixicon/react";
import Cookies from "js-cookie";
import React from "react";

import { COOKIE_NAME, COOKIE_OPTIONS } from "@/config";
import { useGetMeQuery } from "@/api/base/api";
import { signin } from "@/api/auth/slice";
import { useAppDispatch } from "@/hooks";

const Page = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const token = searchParams.get("token");

  const { data: user } = useGetMeQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  React.useEffect(() => {
    if (token) {
      Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    }
  }, [token]);

  React.useEffect(() => {
    if (user) {
      dispatch(signin({ token: String(token), user: user.data }));
      router.replace("/");
    }
  }, [user, dispatch, router, token]);

  return (
    <div className="mx-auto grid h-full max-w-[400px] min-w-[400px] place-items-center">
      <div className="flex w-full flex-col items-center gap-y-6">
        <RiLoaderLine className="animate-spin" />
        <p className="text-sm text-gray-500">Please wait while we finishing logging you in</p>
      </div>
    </div>
  );
};

export default Page;

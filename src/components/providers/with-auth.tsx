"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React from "react";

import { Loader } from "@/components/shared";
import { useAppSelector } from "@/hooks";
import { COOKIE_NAME } from "@/config";

interface WithAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const WithAuth = React.memo(({ children, fallback = <Loader />, redirectTo = "/signin" }: WithAuthProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const token = Cookies.get(COOKIE_NAME);
  const router = useRouter();

  const hasAccess = Boolean(user && token);

  React.useEffect(() => {
    if (!hasAccess) {
      router.replace(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});

WithAuth.displayName = "WithAuth";

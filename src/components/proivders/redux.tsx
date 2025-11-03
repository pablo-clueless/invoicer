"use client";

import { Provider } from "react-redux";
import React from "react";

import { store } from "@/api/store";

interface Props {
  children: React.ReactNode;
}

export const ReduxProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

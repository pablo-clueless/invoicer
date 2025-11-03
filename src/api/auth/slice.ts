import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { COOKIE_NAME, COOKIE_OPTIONS } from "@/config";
import type { Maybe, UserProps } from "@/types";

interface AuthSlice {
  token: string;
  user: Maybe<UserProps>;
}

const initialState: AuthSlice = {
  token: "",
  user: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (state, action: PayloadAction<{ token: string; user: UserProps }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token && typeof window !== "undefined") {
        Cookies.set(COOKIE_NAME, action.payload.token, COOKIE_OPTIONS);
        Cookies.set("USER", JSON.stringify(action.payload.user), COOKIE_OPTIONS);
      } else if (!action.payload.token && typeof window !== "undefined") {
        Cookies.remove(COOKIE_NAME);
      }
    },
    signout: (state) => {
      state.user = null;
      state.token = "";
      Cookies.remove("USER");
      Cookies.remove(COOKIE_NAME);
      window.location.href = "/";
    },
    update: (state, action: PayloadAction<{ user: UserProps }>) => {
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        Cookies.set("USER", JSON.stringify(action.payload.user), COOKIE_OPTIONS);
      }
    },
  },
});

export const { signin, signout } = auth.actions;

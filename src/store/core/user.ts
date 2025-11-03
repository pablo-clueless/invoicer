import Cookies from "js-cookie";

import { COOKIE_NAME, COOKIE_OPTIONS, STORAGE_KEY } from "@/config";
import { createPersistMiddleware } from "../middleware";
import type { Maybe, UserProps } from "@/types";

interface SignOutOptions {
  callbackUrl?: string;
  clearStorage?: boolean;
  redirectUrl?: string;
  soft?: boolean;
}

interface SignInOptions {
  expiresIn?: number;
  redirectUrl?: string;
  remember?: boolean;
}

interface UserStore {
  user: Maybe<UserProps>;
  signin: (data: UserProps, token: string, options?: SignInOptions) => void;
  signout: (options?: SignOutOptions) => void;
  update: (user: UserProps) => void;
}

const initialState: UserStore = {
  user: null,
  signin: () => {},
  signout: () => {},
  update: () => {},
};

class UserManager {
  static clearUserData(clearStorage = true) {
    Cookies.remove(COOKIE_NAME, { path: "/" });
    if (clearStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  static redirect(path: string = "/") {
    window.location.href = path;
  }

  static getCookieOptions(remember?: boolean, expiresIn?: number) {
    return {
      ...COOKIE_OPTIONS,
      expires: remember ? expiresIn || 30 : undefined,
    };
  }
}

const useUserStore = createPersistMiddleware<UserStore>("user-store", (set) => ({
  ...initialState,
  signin: async (user, token, options) => {
    try {
      const cookieOptions = UserManager.getCookieOptions(options?.remember, options?.expiresIn);

      Cookies.set(COOKIE_NAME, token, cookieOptions);
      set({ user });
      if (options?.redirectUrl) {
        window.location.href = options.redirectUrl;
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      throw new Error("Failed to sign in user");
    }
  },
  signout: async (options) => {
    try {
      if (options?.soft) {
        set({ user: null });
        return;
      }
      const token = Cookies.get(COOKIE_NAME);
      if (!token) return;
      UserManager.clearUserData(options?.clearStorage ?? true);
      set({ user: null });

      if (!options?.soft) {
        UserManager.redirect(options?.redirectUrl);
      }
    } catch (error) {
      console.error("Sign out failed:", error);
      UserManager.clearUserData(options?.clearStorage ?? true);
      UserManager.redirect(options?.redirectUrl);
    }
  },
  update: (user) => set({ user }),
}));

export { useUserStore };

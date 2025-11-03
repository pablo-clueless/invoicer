export const COOKIE_NAME = "INVOICER_TOKEN";
export const STORAGE_KEY = "INVOICER_USER";
export const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "strict" as const,
  expires: 30,
};

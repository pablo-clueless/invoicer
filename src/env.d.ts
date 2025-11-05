export const envs = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_BASE_URI",
  "NEXT_PUBLIC_OG_IMAGE",
  "NEXT_PUBLIC_WS_URI",
] as const;

type Envs = (typeof envs)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<Envs, string> {
      readonly NEXT_PUBLIC_APP_URL: string;
      readonly NEXT_PUBLIC_BASE_URI: string;
      readonly NEXT_PUBLIC_OG_IMAGE: string;
      readonly NEXT_PUBLIC_WS_URI: string;
    }
  }
}

export {};

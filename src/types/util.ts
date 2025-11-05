import type { RemixiconComponentType } from "@remixicon/react";

export type Maybe<T> = T | null;

export type Nullable<T> = T | null | undefined;

export type MaybePromise<T> = T | PromiseLike<T>;

export type MaybePromiseOrNull<T> = MaybePromise<Nullable<T>>;

export interface HttpResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface HttpError {
  data: {
    error: string;
    message: string;
    status: number;
    timestamp: string;
    validationErrors?: string[];
  };
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  limit: number;
  page: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedParams {
  page?: number;
  size?: number;
}

export interface RouteProps {
  label: string;
  href: string;
  icon: RemixiconComponentType;
  children?: {
    label: string;
    href: string;
  }[];
}

export type Option = {
  label: string;
  value: string;
  [x: string]: string | number;
};

export interface ValidationError {
  field: string;
  message: string;
  index?: number;
}

export interface ValidationProps {
  errors: ValidationError[];
  isValid: boolean;
  summary?: {
    total: number;
    valid: number;
    invalid: number;
  };
}

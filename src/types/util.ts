import type { RemixiconComponentType } from "@remixicon/react";

export type Maybe<T> = T | null;

export type Nullable<T> = T | null | undefined;

export type MaybePromise<T> = T | PromiseLike<T>;

export type MaybePromiseOrNull<T> = MaybePromise<Nullable<T>>;

export interface HttpResponse<T> {
  data: T;
  message: string;
  status: number;
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
  content: T[];
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
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

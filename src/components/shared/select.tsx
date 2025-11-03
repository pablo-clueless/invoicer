import React from "react";

import type { Option } from "@/types";
import { cn } from "@/lib";
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  options: Option[];
  className?: string;
  error?: { touched?: boolean; message?: string };
  helperText?: string;
  label?: string;
  labelClassName?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  render?: <T extends Option>(option: T) => React.ReactNode;
  required?: boolean;
  value?: string;
  wrapperClassName?: string;
}

export const Select = ({
  options,
  className,
  error,
  helperText,
  label,
  labelClassName,
  onValueChange,
  placeholder,
  render,
  required,
  value,
  wrapperClassName,
}: Props) => {
  return (
    <div className={cn("w-full space-y-0.5", wrapperClassName)}>
      {label && (
        <label
          className={cn(
            "text-sm font-medium text-neutral-700",
            labelClassName,
            required && "after:ml-1 after:text-red-500 after:content-['*']",
          )}
        >
          {label}
        </label>
      )}
      <SelectComponent defaultValue={value} onValueChange={onValueChange} value={value}>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {render ? render(option) : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectComponent>
      {error?.touched && error?.message ? (
        <span className="text-xs text-red-500">{error.message}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}
    </div>
  );
};

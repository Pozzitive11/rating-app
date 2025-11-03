import type { ReactNode } from "react";
import { Label } from "@/shared/ui/primitives/label";
import { FieldError } from "./FieldError";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  errors?: unknown;
  children: ReactNode;
}

export const FieldWrapper = ({
  label,
  required = false,
  errors,
  children,
}: FieldWrapperProps) => {
  return (
    <div>
      <Label className="mb-2">
        {label}
        {required && (
          <span className="text-red-500">*</span>
        )}
      </Label>
      <div>{children}</div>
      <FieldError errors={errors} />
    </div>
  );
};

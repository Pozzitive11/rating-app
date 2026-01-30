import type { ReactNode } from "react";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "./primitives";

interface FieldWrapperProps {
  htmlFor: string;
  label: string;
  description?: string;
  required?: boolean;
  errors?: ReactNode;
  children: ReactNode;
}

export const FieldWrapper = ({
  htmlFor,
  label,
  description,
  required = false,
  errors,
  children,
}: FieldWrapperProps) => {
  return (
    <Field>
      <FieldLabel htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-red-500">*</span>
        )}
      </FieldLabel>
      <FieldContent>{children}</FieldContent>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errors}</FieldError>
    </Field >
  );
};

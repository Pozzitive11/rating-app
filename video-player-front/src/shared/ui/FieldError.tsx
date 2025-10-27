import { isEmpty } from "../utils";

interface FieldErrorProps {
  errors?: unknown;
}

export const FieldError = ({ errors }: FieldErrorProps) => {
  if (
    !errors ||
    !Array.isArray(errors) ||
    isEmpty(errors)
  ) {
    return null;
  }

  return (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <span className="font-medium">⚠️</span>
      {String(errors[0])}
    </p>
  );
};

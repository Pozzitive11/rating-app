import { Button } from "./primitives/button";
import { type ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  title = "Немає даних",
  description,
  buttonText,
  onButtonClick,
  icon,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="text-muted-foreground mb-2">
        {title}
      </div>
      {description && (
        <div className="text-sm text-muted-foreground/80 mb-4">
          {description}
        </div>
      )}
      {buttonText && onButtonClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onButtonClick}
          className="mt-2"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

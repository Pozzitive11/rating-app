import { cn } from "../utils/cn";
import {
  Loader2,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { ReactNode } from "react";

type InfoBlockVariant =
  | "default"
  | "loading"
  | "error"
  | "info"
  | "success";

interface InfoBlockProps {
  title: string;
  variant?: InfoBlockVariant;
  icon?: ReactNode;
  description?: string;
}

const variantStyles = {
  default: {
    container:
      "bg-muted/50 text-muted-foreground border border-muted",
    icon: Info,
    iconClass: "text-muted-foreground",
  },
  loading: {
    container:
      "bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800",
    icon: Loader2,
    iconClass: "text-blue-500 animate-spin",
  },
  error: {
    container:
      "bg-destructive/10 text-destructive border border-destructive/20",
    icon: AlertCircle,
    iconClass: "text-destructive",
  },
  info: {
    container:
      "bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800",
    icon: Info,
    iconClass: "text-blue-500",
  },
  success: {
    container:
      "bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-800",
    icon: CheckCircle2,
    iconClass: "text-green-500",
  },
};

const InfoBlock = ({
  title,
  variant = "default",
  icon,
  description,
}: InfoBlockProps) => {
  const style = variantStyles[variant];
  const IconComponent = style.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-200 shadow-sm",
        style.container
      )}
    >
      <div className="flex items-center gap-3">
        <div className={style.iconClass}>
          {icon || <IconComponent className="size-8" />}
        </div>

        <p className="text-base font-semibold leading-relaxed">
          {title}
        </p>
      </div>

      {description && (
        <p className="text-sm opacity-80 leading-relaxed mt-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default InfoBlock;

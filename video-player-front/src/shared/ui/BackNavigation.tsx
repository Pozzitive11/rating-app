import { ChevronLeft } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

interface BackNavigationProps {
  text: string;
  className?: string;
}

export const BackNavigation = ({
  text,
  className = "",
}: BackNavigationProps) => {
  const router = useRouter();

  return (
    <Link
      to="/"
      className={`group flex items-center gap-3 mb-6 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg p-1 -ml-1 ${className}`}
      onClick={(e) => {
        e.preventDefault();
        router.history.back();
        return false;
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground shadow-sm group-hover:bg-accent group-hover:text-accent-foreground">
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground">
        {text}
      </h1>
    </Link>
  );
};

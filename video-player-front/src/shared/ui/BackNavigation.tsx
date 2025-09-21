import { ArrowLeftIcon } from "lucide-react";
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
      className={`text-2xl font-bold flex items-center gap-2 mb-4 ${className}`}
      onClick={e => {
        e.preventDefault();
        router.history.back();
        return false;
      }}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      {text}
    </Link>
  );
};

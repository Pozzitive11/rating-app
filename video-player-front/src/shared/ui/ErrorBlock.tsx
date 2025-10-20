import { AlertCircle } from "lucide-react";

const ErrorBlock = ({
  title,
  error,
}: {
  title: string;
  error: Error;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-2 border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900 rounded-lg">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <AlertCircle className="w-5 h-5" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 text-center">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
    </div>
  );
};

export default ErrorBlock;

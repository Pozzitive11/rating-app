import React from "react";
import { toast } from "sonner";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (
    error: Error,
    errorInfo: React.ErrorInfo
  ) => void;
  showToast?: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ) {
    // Log error to console for debugging
    console.error(
      "ErrorBoundary caught an error:",
      error,
      errorInfo
    );

    // Show toast notification if enabled
    if (this.props.showToast) {
      toast.error("Помилка мережі", {
        description: "Перевірте підключення до інтернету",
        duration: 5000,
        action: {
          label: "Перезавантажити",
          onClick: () => window.location.reload(),
        },
      });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Oops! Something went wrong Уупс! Щось пішло не
              так
            </h1>
            <p className="mb-4 text-muted-foreground">
              Нажаль щось несподівано пішло не так. Будь
              ласка, спробуйте перезавантажити сторінку.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Перезавантажити сторінку
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

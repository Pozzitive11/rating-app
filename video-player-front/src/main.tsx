import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import ErrorBoundary from "./shared/ErrorBoundaty";
import { Toaster } from "./shared/ui";
import { toast } from "sonner";
import { AuthProvider } from "./features/auth/hooks/useAuth";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
    mutations: {
      onError: (error: any) => {
        console.error("Mutation error:", error);
        toast.error("Помилка операції", {
          description:
            error?.message || "Спробуйте пізніше",
          duration: 2000,
        });
      },
    },
  },
});

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <ErrorBoundary showToast={true}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
          </QueryClientProvider>
        </ErrorBoundary>
      </AuthProvider>
    </StrictMode>
  );
}

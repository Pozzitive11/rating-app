import { Header } from "@/shared/layout";
import {
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth } from "@/features/auth/hooks/useAuth";
export const Route = createRootRoute({
  component: () => <RootLayout />,
});

const RootLayout = () => {
  const { userId } = useAuth();
  return (
    <>
      <div className="min-h-screen bg-background">
        {userId && <Header />}
        <div className="container mx-auto container-padding max-w-md lg:max-w-lg xl:max-w-xl h-full">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
  );
};

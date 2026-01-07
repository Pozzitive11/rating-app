import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { RateBeerPage } from "@/pages/RateBeerPage";
import MainLayout from "@/shared/layout/MainLayout";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/rate-beer/$beerId"
)({
  component: RouteComponent,
});
function RouteComponent() {
  const { isLoading } = useAuthGuard();

  if (isLoading) return <div>Loading...</div>;

  return (
    <MainLayout backNavigationText="Оцінити пиво">
      <RateBeerPage />
    </MainLayout>
  );
}

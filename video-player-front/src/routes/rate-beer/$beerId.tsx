import { RateBeerPage } from "@/pages/RateBeerPage";
import MainLayout from "@/shared/layout/MainLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rate-beer/$beerId")({
  component: () => (
    <MainLayout backNavigationText="Оцінити пиво">
      <RateBeerPage />
    </MainLayout>
  ),
});

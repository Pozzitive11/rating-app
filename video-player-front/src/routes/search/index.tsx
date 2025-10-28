import { createFileRoute } from "@tanstack/react-router";
import { SearchBeerPage } from "@/pages/SearchBeerPage";
import MainLayout from "@/shared/layout/MainLayout";

export const Route = createFileRoute("/search/")({
  component: () => (
    <MainLayout backNavigationText="Пошук пива">
      <SearchBeerPage />
    </MainLayout>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { SearchBeerPage } from "@/pages/SearchBeerPage";
import MainLayout from "@/shared/layout/MainLayout";

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute("/search/")({
  component: () => (
    <MainLayout backNavigationText="Пошук пива">
      <SearchBeerPage />
    </MainLayout>
  ),
  validateSearch: (
    search: Record<string, unknown>
  ): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
});

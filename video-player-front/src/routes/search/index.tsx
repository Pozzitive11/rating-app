import { createFileRoute } from "@tanstack/react-router";
import { SearchBeerPage } from "@/pages/SearchBeerPage";

export const Route = createFileRoute("/search/")({
  component: SearchBeerPage,
});

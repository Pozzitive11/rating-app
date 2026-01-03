import { BeerDetailsPage } from "@/pages/BeerDetailsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/beer-details/$beerId"
)({
  component: BeerDetailsPage,
});

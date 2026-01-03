import { BeerDetailsPage } from "@/pages/BeerDetailsPage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/beer-details/$beerId"
)({
  component: BeerDetailsPage,
});

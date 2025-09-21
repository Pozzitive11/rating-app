import { BeerDetailsPage } from "@/pages/BeerDetailsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/beer-details/$beerId"
)({
  component: BeerDetailsPage,
  loader: async ({ params }) => {
    // TODO: get beer from api
    return {
      beerId: params.beerId,
    };
  },
  // pendingComponent: () => <div>Loading...</div>,
  // errorComponent: () => <div>Error</div>,
});

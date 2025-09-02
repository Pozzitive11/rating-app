import { createFileRoute } from "@tanstack/react-router";
import BeerDetailsPage from "../pages/BeerDetailsPage/BeerDetailsPage";

export const Route = createFileRoute("/$id")({
  component: BeerDetailsPage,
  loader: async ({ params }) => {
    // TODO: get beer from api
    return {
      beerId: params.id,
    };
  },
  // pendingComponent: () => <div>Loading...</div>,
  // errorComponent: () => <div>Error</div>,
});

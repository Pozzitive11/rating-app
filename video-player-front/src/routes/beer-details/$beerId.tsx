import { getBeerById } from "@/api/beer/api";
import { BeerDetailsPage } from "@/pages/BeerDetailsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/beer-details/$beerId"
)({
  component: BeerDetailsPage,
  loader: async ({ params }) => {
    const beer = await getBeerById(Number(params.beerId));
    return {
      beer,
    };
  },
  // pendingComponent: () => <div>Loading...</div>,
  // errorComponent: () => <div>Error</div>,
});

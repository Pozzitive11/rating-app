import RateBeerPage from "@/pages/RateBeerPage/RateBeerPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rate-beer/$beerId")({
  component: RateBeerPage,
  loader: async ({ params }) => {
    // TODO: get beer from api
    return {
      beerId: params.beerId,
    };
  },
  // pendingComponent: () => <div>Loading...</div>,
  // errorComponent: () => <div>Error</div>,
});

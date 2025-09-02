import { createFileRoute } from "@tanstack/react-router";
import RateBeerPage from "../pages/RateBeerPage/RateBeerPage";

export const Route = createFileRoute("/rate-beer")({
  component: RateBeerPage,
});

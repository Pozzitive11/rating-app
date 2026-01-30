import { createLazyFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createLazyFileRoute("/my-ratings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}

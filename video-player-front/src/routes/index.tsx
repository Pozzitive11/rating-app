import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { HomePage } from "../pages/HomePage";
import { tokenUtils } from "@/features/auth/utils/token.utils";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    // Check if user is authenticated
    if (!tokenUtils.isAuthenticated()) {
      // Redirect to register page if not authenticated
      throw redirect({
        to: "/register",
      });
    }
  },
  component: HomePage,
});

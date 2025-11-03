import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { tokenUtils } from "@/features/auth/utils/token.utils";

export const Route = createFileRoute("/auth/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract tokens from URL hash (Supabase redirects with hash fragments)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken =
          hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (accessToken && type === "signup") {
          // Store tokens
          tokenUtils.setTokens(
            accessToken,
            refreshToken || undefined
          );

          // Fetch user info
          // You'll need to add a method to get user from token
          setStatus("success");

          // Redirect to home after a short delay
          setTimeout(() => {
            navigate({ to: "/" });
          }, 1500);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("error");
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Confirming email...</div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Email confirmed! Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Error confirming email. Please try again.</div>
    </div>
  );
}

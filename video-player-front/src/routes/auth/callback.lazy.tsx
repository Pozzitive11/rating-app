import {
  useNavigate,
  createLazyFileRoute,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { tokenUtils } from "@/features/auth/utils/token.utils";
import { InfoBlock } from "@/shared/ui";

export const Route = createLazyFileRoute("/auth/callback")({
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
        setStatus("error");
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === "loading") {
    return (
      <InfoBlock
        title="Confirming email..."
        description="Please wait while we confirm your email."
        variant="loading"
      />
    );
  }

  if (status === "success") {
    return (
      <InfoBlock
        title="Email confirmed!"
        description="Redirecting to home..."
        variant="success"
      />
    );
  }

  return (
    <InfoBlock
      title="Error confirming email"
      description="Please try again."
      variant="error"
    />
  );
}

import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./useAuth";

export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};

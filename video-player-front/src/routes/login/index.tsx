import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(values.email, values.password);
      navigate({ to: "/" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
      {error && (
        <p className="text-red-500 mt-4 text-center">
          {error}
        </p>
      )}
    </>
  );
}

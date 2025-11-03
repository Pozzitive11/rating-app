import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";

export const Route = createFileRoute("/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await register(values.email, values.password);
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
    <div>
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
      />
      {error && (
        <p className="text-red-500 mt-4 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";

import { Modal } from "@/shared/ui";

export const Route = createFileRoute("/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] =
    useState(false);

  const handleRegister = async (values: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await register(values.email, values.password);
      setShowSuccessDialog(true);
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
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
      />
      {error && (
        <p className="text-red-500 mt-4 text-center">
          {error}
        </p>
      )}

      <Modal
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Registration Successful!"
        description="Please check your email to confirm your account."
      />
    </>
  );
}

import { createLazyFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import { InfoBlock } from "@/shared/ui";
import { Modal } from "@/shared/ui";

export const Route = createLazyFileRoute("/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { register, error, isLoading } = useAuth();
  const [showSuccessDialog, setShowSuccessDialog] =
    useState(false);

  const handleRegister = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      await register(values.email, values.password);
      // Only show success dialog on successful registration
      setShowSuccessDialog(true);
    } catch (err) {
      // Error is already handled by useAuth and will be shown via error state
    }
  };

  return (
    <>
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
      />
      {error && (
        <InfoBlock title={error.message} variant="error" />
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

import {
  useNavigate,
  createLazyFileRoute,
} from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { InfoBlock } from "@/shared/ui";

export const Route = createLazyFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      await login(values.email, values.password);
      // Only navigate on successful login
      navigate({ to: "/" });
    } catch (err) {
      // Error is already handled by useAuth and will be shown via error state
      // No need to navigate on error
    }
  };

  return (
    <>
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
      {error && (
        <InfoBlock title={error.message} variant="error" />
      )}
    </>
  );
}

import { useForm } from "@tanstack/react-form";
import { Button, FieldWrapper, Input } from "@/shared/ui";

export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (
    values: Omit<RegisterFormValues, "confirmPassword">
  ) => void | Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm = ({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) => {
  const form = useForm({
    defaultValues: {
      email: "test@test.com",
      password: "testtest",
      confirmPassword: "testtest",
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...formData } = value;
      await onSubmit(formData);
    },
  });

  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => validateEmail(value),
        }}
        children={field => (
          <FieldWrapper
            label="Email"
            required
            errors={field.state.meta.errors}
          >
            <Input
              type="email"
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="Enter your email"
              aria-invalid={
                field.state.meta.errors.length > 0
              }
            />
          </FieldWrapper>
        )}
      />

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => validatePassword(value),
        }}
        children={field => (
          <FieldWrapper
            label="Password"
            required
            errors={field.state.meta.errors}
          >
            <Input
              type="password"
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="Enter your password"
              aria-invalid={
                field.state.meta.errors.length > 0
              }
            />
          </FieldWrapper>
        )}
      />

      <form.Field
        name="confirmPassword"
        validators={{
          onChange: ({ value }) => {
            const password = form.state.values.password;
            if (!value) {
              return "Please confirm your password";
            }
            if (value !== password) {
              return "Passwords do not match";
            }
            return undefined;
          },
          onBlur: ({ value }) => {
            const password = form.state.values.password;
            if (!value) {
              return "Please confirm your password";
            }
            if (value !== password) {
              return "Passwords do not match";
            }
            return undefined;
          },
        }}
        children={field => (
          <FieldWrapper
            label="Confirm Password"
            required
            errors={field.state.meta.errors}
          >
            <Input
              type="password"
              value={field.state.value}
              onChange={e =>
                field.handleChange(e.target.value)
              }
              onBlur={field.handleBlur}
              placeholder="Confirm your password"
              aria-invalid={
                field.state.meta.errors.length > 0
              }
            />
          </FieldWrapper>
        )}
      />

      <form.Subscribe
        selector={state => [
          state.canSubmit,
          state.isSubmitting,
        ]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            variant="default"
            disabled={
              !canSubmit || isSubmitting || isLoading
            }
            isLoading={isSubmitting || isLoading}
            className="w-full cursor-pointer"
          >
            Register
          </Button>
        )}
      />
    </form>
  );
};

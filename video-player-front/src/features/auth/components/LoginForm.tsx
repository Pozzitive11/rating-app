import { useForm } from "@tanstack/react-form";
import { Button, FieldWrapper, Input } from "@/shared/ui";
import { Link } from "@tanstack/react-router";
import {
  validateEmail,
  validatePassword,
} from "../utils/validators";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (
    values: LoginFormValues
  ) => void | Promise<void>;
  isLoading?: boolean;
}

export const LoginForm = ({
  onSubmit,
  isLoading = false,
}: LoginFormProps) => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <>
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
              label="Електронна пошта"
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
                placeholder="Введіть вашу email"
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
            onChange: ({ value }) =>
              validatePassword(value),
          }}
          children={field => (
            <FieldWrapper
              label="Пароль"
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
                placeholder="Введіть ваш пароль"
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
              className="w-full"
            >
              Увійти
            </Button>
          )}
        />
      </form>

      <p className="text-sm text-center mt-4">
        Не маєш акаунту?{" "}
        <Link
          to="/register"
          className="text-blue-500 hover:text-blue-600"
        >
          Зареєструватися
        </Link>
      </p>
    </>
  );
};

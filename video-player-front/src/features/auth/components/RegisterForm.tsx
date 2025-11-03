import { useForm } from "@tanstack/react-form";
import { Button, FieldWrapper, Input } from "@/shared/ui";
import { Link } from "@tanstack/react-router";
import {
  validateEmail,
  validatePassword,
} from "../utils/validators";

export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const validateConfirmPassword = (
  value: string,
  password: string
) => {
  if (!value) {
    return "Будь ласка, підтвердіть пароль";
  }
  if (value !== password) {
    return "Паролі не збігаються";
  }
  return undefined;
};

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
      email: "palahinvlad@gmail.com",
      password: "testtest",
      confirmPassword: "testtest",
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...formData } = value;
      await onSubmit(formData);
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

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value }) => {
              const password = form.state.values.password;
              return validateConfirmPassword(
                value,
                password
              );
            },
            onBlur: ({ value }) => {
              const password = form.state.values.password;
              return validateConfirmPassword(
                value,
                password
              );
            },
          }}
          children={field => (
            <FieldWrapper
              label="Підтвердіть пароль"
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
                placeholder="Підтвердіть ваш пароль"
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
              Зареєструватися
            </Button>
          )}
        />
      </form>
      <p className="text-sm text-center mt-4">
        Вже маєш акаунт?{" "}
        <Link
          to="/login"
          className="text-blue-500 hover:text-blue-600"
        >
          Увійти
        </Link>
      </p>
    </>
  );
};

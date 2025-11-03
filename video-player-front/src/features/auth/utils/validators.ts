export const validateEmail = (value: string) => {
  if (!value) {
    return "Електронна пошта є обов'язковою";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Будь ласка, введіть дійсну електронну пошту";
  }
  return undefined;
};

export const validatePassword = (value: string) => {
  if (!value) {
    return "Пароль є обов'язковим";
  }
  if (value.length < 6) {
    return "Пароль повинен бути не менше 6 символів";
  }
  return undefined;
};

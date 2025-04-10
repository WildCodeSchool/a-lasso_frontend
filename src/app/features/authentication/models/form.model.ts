export type FormField = {
  name: string;
  label?: string;
  type: string;
  required?: boolean;
  showPasswordRules?: boolean;
  children?: FormField[];
};

export type LoginForm = {
  email: string;
  password: string;
};

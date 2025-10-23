export type FormField = {
  name: string;
  label?: string;
  type?: string;
  min?: number;
  placeholder?: string;
  required?: boolean;
  showPasswordRules?: boolean;
  children?: FormField[];
};

export type LoginForm = {
  email: string;
  password: string;
};

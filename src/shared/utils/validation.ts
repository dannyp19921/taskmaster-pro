// /src/shared/utils/validation.ts

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'E-post er påkrevd';
  }
  
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Ugyldig e-postformat';
  }
  
  return null;
};

export const validatePassword = (password: string, minLength = 6): string | null => {
  if (!password) {
    return 'Passord er påkrevd';
  }
  
  if (password.length < minLength) {
    return `Passord må være minst ${minLength} tegn`;
  }
  
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return 'Passordene matcher ikke';
  }
  
  return null;
};

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
}

export const validateLoginForm = (data: LoginFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateRegisterForm = (data: RegisterFormData): Record<string, string> => {
  const errors = validateLoginForm(data);
  
  const matchError = validatePasswordMatch(data.password, data.confirmPassword);
  if (matchError) errors.confirmPassword = matchError;
  
  return errors;
};
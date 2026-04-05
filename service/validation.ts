// src/utils/validation.ts
import { LoginFormData, SignupFormData, AuthError } from '../utils/module';

export const validateLogin = (data: LoginFormData): AuthError[] => {
  const errors: AuthError[] = [];
  
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push({ field: 'email', message: 'Email is invalid' });
  }
  
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }
  
  return errors;
};

export const validateSignup = (data: SignupFormData): AuthError[] => {
  const errors: AuthError[] = [];
  
  if (!data.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  
  if (!data.username) {
    errors.push({ field: 'username', message: 'Username is required' });
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push({ field: 'username', message: 'Username can only contain letters, numbers and underscores' });
  }
  
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push({ field: 'email', message: 'Email is invalid' });
  }
  
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }
  
  if (!data.mobile) {
    errors.push({ field: 'mobile', message: 'Mobile number is required' });
  } else if (!/^\d{10}$/.test(data.mobile)) {
    errors.push({ field: 'mobile', message: 'Mobile number must be 10 digits' });
  }
  
  return errors;
};
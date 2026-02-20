import { z } from 'zod';

// Fintech-grade regex from directive
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

export const loginSchema = z.object({
  username: z.string().min(1, 'Email or Username required'),
  password: z.string().min(1, 'Password required'),
});

export const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(usernameRegex, '3-20 characters, alphanumeric or underscores only'),
  email: z.string()
    .regex(emailRegex, 'Invalid email format'),
  password: z.string()
    .regex(passwordRegex, 'Password must be 8+ chars, include uppercase, lowercase, number and special char (@$!%*?&)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

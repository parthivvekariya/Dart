import { z } from 'zod';

import { UserSchema } from '@/api/user/userModel';

export const SignupSchema = z.object({
  body: z.object({
    email: UserSchema.shape.email,
    name: UserSchema.shape.name,
    phone: UserSchema.shape.phone,
    address: UserSchema.shape.address,
    password: z.string(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string() }),
});

export const ForgetPasswordSchema = z.object({
  body: z.object({ email: z.string().email() }),
});

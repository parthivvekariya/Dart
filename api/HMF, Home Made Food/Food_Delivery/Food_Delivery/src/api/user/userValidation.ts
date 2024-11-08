// Input Validation for 'GET users/:id' endpoint
import { z } from 'zod';

import { UserSchema } from '@/api/user/userModel';
import { commonValidations } from '@/common/utils/commonValidation';

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetUserProfileSchema = z.object({
  headers: z.object({ 'x-user-id': commonValidations.id }),
});

export const UpdateUserSchema = z.object({
  headers: z.object({ 'x-user-id': commonValidations.id }),
  body: UserSchema.pick({
    name: true,
    address: true,
    phone: true,
    profilePic: true,
  }).partial(),
});

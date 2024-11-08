import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export const TABLE_NAME = 'ip-admin';
export type News = z.infer<typeof NewsSchema>;
export const NewsSchema = z.object({
  newsId: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  ctaLink: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

// Input Validation for 'GET admin/:id' endpoint
export const GetNewsSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Input Validation for 'POST admin' endpoint
export const CreateNewsSchema = z.object({
  headers: z.object({ 'x-user-id': commonValidations.id }),
  body: NewsSchema.pick({
    type: true,
    title: true,
    description: true,
  }),
});

import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

export const GetReviewByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateReviewSchema = z.object({
  headers: z.object({ 'x-user-id': commonValidations.id }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(500),
    restaurantId: commonValidations.id,
  }),
});

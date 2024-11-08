import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

export const GetRestaurantByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetRestaurantBySearchSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    cuisineType: z.string().optional(),
    rating: z.number().optional(),
    sortBy: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
});

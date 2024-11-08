import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

export const GetMenuByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

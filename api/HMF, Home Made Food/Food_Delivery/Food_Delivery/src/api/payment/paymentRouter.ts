import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { PaymentSchema } from '@/api/payment/paymentModel';
import { UserSchema } from '@/api/user/userModel';
import { userService } from '@/api/user/userService';
import { GetUserProfileSchema, UpdateUserSchema } from '@/api/user/userValidation';
import { createApiResponse, updateApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const paymentRegistry = new OpenAPIRegistry();

paymentRegistry.register('Payment', PaymentSchema);

export const paymentRouter: Router = (() => {
  const router = express.Router();

  paymentRegistry.registerPath({
    method: 'get',
    path: '/user',
    tags: ['User', 'Get'],
    request: { headers: GetUserProfileSchema.shape.headers },
    responses: createApiResponse(UserSchema, 'Success'),
  });
  router.get('/', validateRequest(GetUserProfileSchema), async (req: Request, res: Response) => {
    const publicKey = req.headers['x-user-id'];
    const serviceResponse = await userService.findById(publicKey as string);
    handleServiceResponse(serviceResponse, res);
  });

  paymentRegistry.registerPath({
    method: 'patch',
    path: '/user/update-profile',
    tags: ['User', 'Update', 'Profile'],
    request: {
      headers: UpdateUserSchema.shape.headers,
      body: {
        content: {
          'application/json': {
            schema: UpdateUserSchema.shape.body,
          },
        },
      },
    },
    responses: updateApiResponse(UserSchema, 'Success'),
  });
  router.patch('/update-profile', validateRequest(UpdateUserSchema), async (req: Request, res: Response) => {
    const publicKey = req.headers['x-user-id'];
    const payload = req.body;

    const serviceResponse = await userService.updateProfile(publicKey as string, payload);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

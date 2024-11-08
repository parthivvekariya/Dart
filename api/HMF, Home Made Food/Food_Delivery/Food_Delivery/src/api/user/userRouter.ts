import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { UserSchema } from '@/api/user/userModel';
import { userService } from '@/api/user/userService';
import { GetUserProfileSchema, UpdateUserSchema } from '@/api/user/userValidation';
import { createApiResponse, updateApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'get',
    path: '/user',
    tags: ['User'],
    request: { headers: GetUserProfileSchema.shape.headers },
    responses: createApiResponse(UserSchema, 'Success'),
  });
  router.get('/', validateRequest(GetUserProfileSchema), async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'];
    const serviceResponse = await userService.findById(userId as string);
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'patch',
    path: '/user/update-profile',
    tags: ['User'],
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
    const userId = req.headers['x-user-id'];
    const payload = req.body;

    const serviceResponse = await userService.updateProfile(userId as string, payload);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

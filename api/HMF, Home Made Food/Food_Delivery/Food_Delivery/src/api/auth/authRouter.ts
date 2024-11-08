import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { ForgetPasswordSchema, LoginSchema, SignupSchema } from '@/api/auth/authValidation';
import { UserSchema } from '@/api/user/userModel';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { authService } from './authService';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(
      z.object({
        userId: z.string(),
        token: z.string(),
      }),
      'Success'
    ),
  });

  router.post('/login', validateRequest(LoginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const serviceResponse = await authService.login(email, password);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/signup',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: SignupSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(
      z.object({
        userId: z.string(),
      }),
      'Success'
    ),
  });

  router.post('/signup', validateRequest(SignupSchema), async (req: Request, res: Response) => {
    const userDetails = req.body;
    const serviceResponse = await authService.signup(userDetails);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/forgot-password',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ForgetPasswordSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.post('/forgot-password', validateRequest(ForgetPasswordSchema), async (req: Request, res: Response) => {
    const { email } = req.body;
    const serviceResponse = await authService.forgetPassword(email);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

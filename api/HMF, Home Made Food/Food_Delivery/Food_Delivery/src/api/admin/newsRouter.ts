import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { randomUUID } from 'crypto';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { CreateNewsSchema, GetNewsSchema, NewsSchema } from '@/api/admin/newsModel';
import { newsService } from '@/api/admin/newsService';
import { userService } from '@/api/user/userService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const newsRegistry = new OpenAPIRegistry();

newsRegistry.register('News', NewsSchema);

export const newsRouter: Router = (() => {
  const router = express.Router();

  newsRegistry.registerPath({
    method: 'get',
    path: '/admin/all',
    tags: ['News'],
    responses: createApiResponse(z.array(NewsSchema), 'Success'),
  });

  router.get('/all', async (_req: Request, res: Response) => {
    const serviceResponse = await newsService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  newsRegistry.registerPath({
    method: 'get',
    path: '/admin/{id}',
    tags: ['News'],
    request: { params: GetNewsSchema.shape.params },
    responses: createApiResponse(NewsSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetNewsSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await newsService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  newsRegistry.registerPath({
    method: 'post',
    path: '/admin/create',
    tags: ['News'],
    request: {
      headers: CreateNewsSchema.shape.headers,
      body: {
        content: {
          'application/json': {
            schema: CreateNewsSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(NewsSchema, 'Success'),
  });

  router.post('/create', validateRequest(CreateNewsSchema), async (req: Request, res: Response) => {
    const publicKey = req.headers['x-user-id'];
    const userServiceResponse = await userService.findById(publicKey as string);
    const user = userServiceResponse.responseObject;

    if (!user || user.role !== 'admin') {
      const errorMessage = 'User does not have permission to create admin';
      const serviceResponse = new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.UNAUTHORIZED);
      handleServiceResponse(serviceResponse, res);
      return;
    }

    const requestBody = req.body;
    const news = {
      ...requestBody,
      newsId: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const serviceResponse = await newsService.create(news);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

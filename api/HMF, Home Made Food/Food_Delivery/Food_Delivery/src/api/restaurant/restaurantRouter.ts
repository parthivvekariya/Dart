import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { RestaurantScheme } from '@/api/restaurant/restaurantModel';
import { GetRestaurantByIdSchema, GetRestaurantBySearchSchema } from '@/api/restaurant/restaurantValidation';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { restaurantService } from './restaurantService';

interface SearchParams {
  location?: string;
  cuisineType?: string;
  rating?: number;
  sortBy?: 'asc' | 'desc';
  limit?: number;
  lastEvaluatedKey?: any;
}

export const restaurantRegistry = new OpenAPIRegistry();

restaurantRegistry.register('Restaurant', RestaurantScheme);

export const restaurantRouter: Router = (() => {
  const router = express.Router();

  restaurantRegistry.registerPath({
    method: 'get',
    path: '/restaurant',
    tags: ['Restaurant'],
    responses: createApiResponse(z.array(RestaurantScheme), 'Success'),
  });
  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await restaurantService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  restaurantRegistry.registerPath({
    method: 'get',
    path: '/restaurant/{restaurantId}',
    tags: ['Restaurant'],
    request: { params: GetRestaurantByIdSchema.shape.params },
    responses: createApiResponse(RestaurantScheme, 'Success'),
  });
  router.get('/:restaurantId', validateRequest(GetRestaurantByIdSchema), async (_req: Request, res: Response) => {
    const id = _req.params.restaurantId as string;
    const serviceResponse = await restaurantService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  restaurantRegistry.registerPath({
    method: 'get',
    path: '/restaurant/search',
    tags: ['Restaurant'],
    request: { query: GetRestaurantBySearchSchema.shape.query },
    responses: createApiResponse(z.array(RestaurantScheme), 'Success'),
  });

  router.get('/search', validateRequest(GetRestaurantBySearchSchema), async (req: Request, res: Response) => {
    const query = req.query as SearchParams;
    const serviceResponse = await restaurantService.search(query);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

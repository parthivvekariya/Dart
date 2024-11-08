import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { MenuSchema } from '@/api/menu/menuModel';
import { menuService } from '@/api/menu/menuService';
import { GetMenuByIdSchema } from '@/api/menu/menuValidation';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const menuRegistry = new OpenAPIRegistry();

menuRegistry.register('Menu', MenuSchema);

export const menuRouter: Router = (() => {
  const router = express.Router();

  menuRegistry.registerPath({
    method: 'get',
    path: '/menu/{menuId}',
    tags: ['Menu'],
    request: { params: GetMenuByIdSchema.shape.params },
    responses: createApiResponse(MenuSchema, 'Success'),
  });
  router.get('/:menuId', validateRequest(GetMenuByIdSchema), async (_req: Request, res: Response) => {
    const id = _req.params.menuId as string;
    const serviceResponse = await menuService.getById(id);
    handleServiceResponse(serviceResponse, res);
  });

  menuRegistry.registerPath({
    method: 'get',
    path: '/menu/restaurant/{restaurantId}',
    tags: ['Menu'],
    request: { params: GetMenuByIdSchema.shape.params },
    responses: createApiResponse(MenuSchema, 'Success'),
  });
  router.get('/restaurant/:restaurantId', validateRequest(GetMenuByIdSchema), async (_req: Request, res: Response) => {
    const id = _req.params.restaurantId as string;
    const serviceResponse = await menuService.getByRestaurantId(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

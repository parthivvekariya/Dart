import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { ReviewSchema } from '@/api/review/reviewModel';
import { reviewService } from '@/api/review/reviewService';
import { CreateReviewSchema, GetReviewByIdSchema } from '@/api/review/reviewValidation';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const reviewRegistry = new OpenAPIRegistry();

reviewRegistry.register('Review', ReviewSchema);

export const reviewRouter: Router = (() => {
  const router = express.Router();

  reviewRegistry.registerPath({
    method: 'post',
    path: '/review/create',
    tags: ['Menu'],
    request: {
      headers: CreateReviewSchema.shape.headers,
      body: {
        content: {
          'application/json': {
            schema: CreateReviewSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(ReviewSchema, 'Success'),
  });
  router.post('/create', validateRequest(CreateReviewSchema), async (_req: Request, res: Response) => {
    const userId = _req.headers['x-user-id'] as string;
    const payload = _req.body;
    const review = { ...payload, userId };
    const serviceResponse = await reviewService.createReview(review);
    handleServiceResponse(serviceResponse, res);
  });

  reviewRegistry.registerPath({
    method: 'get',
    path: '/review/restaurant/{restaurantId}',
    tags: ['Review'],
    request: { params: GetReviewByIdSchema.shape.params },
    responses: createApiResponse(ReviewSchema, 'Success'),
  });
  router.get(
    '/restaurant/:restaurantId',
    validateRequest(GetReviewByIdSchema),
    async (_req: Request, res: Response) => {
      const userId = _req.params.restaurantId as string;
      const serviceResponse = await reviewService.getByRestaurantId(userId);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();

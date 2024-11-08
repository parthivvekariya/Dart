import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { CollectionSchema, GetCollectionByIdSchema, GetCollectionSchema } from '@/api/refund/collectionModel';
import { collectionService } from '@/api/refund/collectionService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

export const collectionRegistry = new OpenAPIRegistry();

collectionRegistry.register('Collection', CollectionSchema);

export const collectionRouter: Router = (() => {
  const router = express.Router();

  collectionRegistry.registerPath({
    method: 'get',
    path: '/collections',
    tags: ['Collection'],
    request: { query: GetCollectionSchema.shape.query },
    responses: createApiResponse(z.array(CollectionSchema), 'Success'),
  });
  router.get('/', async (_req: Request, res: Response) => {
    const sortBy = _req.query.sortBy as string;
    const limit = _req.query.limit as string;

    const collectionId = _req.query.collectionId as string;
    const lastTradedPrice = _req.query.lastTradedPrice !== undefined ? Number(_req.query.lastTradedPrice) : undefined;
    const createdAt = _req.query.createdAt as string;

    const offset =
      lastTradedPrice !== undefined && collectionId
        ? { collectionId, lastTradedPrice }
        : createdAt && collectionId
          ? { collectionId, createdAt }
          : undefined;

    const serviceResponse = await collectionService.findAll(
      sortBy ? sortBy : undefined,
      limit ? parseInt(limit, 10) : undefined,
      offset
    );
    handleServiceResponse(serviceResponse, res);
  });

  collectionRegistry.registerPath({
    method: 'get',
    path: '/collections/search',
    tags: ['Collection', 'Search', 'Query'],
    request: { query: GetCollectionSchema.shape.query },
    responses: createApiResponse(z.array(CollectionSchema), 'Success'),
  });
  router.get('/search', async (_req: Request, res: Response) => {
    const query = _req.query.query as string;
    const limit = _req.query.limit as string;
    const offset = _req.query.offset as string;

    const serviceResponse = await collectionService.searchByTagsOrCaptionOrTickerName(
      query,
      limit ? parseInt(limit, 10) : undefined,
      offset ? parseInt(offset, 10) : undefined
    );
    handleServiceResponse(serviceResponse, res);
  });

  collectionRegistry.registerPath({
    method: 'get',
    path: '/collections/get-latest-mint',
    tags: ['Collection'],
    request: { params: GetCollectionByIdSchema.shape.params },
    responses: createApiResponse(CollectionSchema, 'Success'),
  });
  router.get('/get-latest-mint', async (req: Request, res: Response) => {
    const serviceResponse = await collectionService.getLatestMints();
    handleServiceResponse(serviceResponse, res);
  });

  collectionRegistry.registerPath({
    method: 'get',
    path: '/collections/get-trending-mint',
    tags: ['Collection'],
    request: { params: GetCollectionByIdSchema.shape.params },
    responses: createApiResponse(CollectionSchema, 'Success'),
  });
  router.get('/get-trending-mint', async (req: Request, res: Response) => {
    const serviceResponse = await collectionService.getTrendingMints();
    handleServiceResponse(serviceResponse, res);
  });

  collectionRegistry.registerPath({
    method: 'post',
    path: '/collections/search-by-ids',
    tags: ['Collection'],
    request: { params: GetCollectionByIdSchema.shape.params },
    responses: createApiResponse(CollectionSchema, 'Success'),
  });
  router.post('/search-by-ids', async (req: Request, res: Response) => {
    const payload = req.body;
    const serviceResponse = await collectionService.getMintsByIdList(payload);
    handleServiceResponse(serviceResponse, res);
  });

  collectionRegistry.registerPath({
    method: 'get',
    path: '/collections/{id}',
    tags: ['Collection'],
    request: { params: GetCollectionByIdSchema.shape.params },
    responses: createApiResponse(CollectionSchema, 'Success'),
  });
  router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await collectionService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  collectionRegistry.registerPath({
    method: 'post',
    path: '/collections/search',
    tags: ['Collection'],
    request: { params: GetCollectionByIdSchema.shape.params },
    responses: createApiResponse(CollectionSchema, 'Success'),
  });
  router.post('/search', async (req: Request, res: Response) => {
    const payload = req.body;
    const serviceResponse = await collectionService.searchCommunity(payload);
    handleServiceResponse(serviceResponse, res);
  });

  // router.post('/', async (req: Request, res: Response) => {
  //   const payload = req.body;
  //   const serviceResponse = await collectionService.createCollection(payload);
  //   handleServiceResponse(serviceResponse, res);
  // });

  return router;
})();

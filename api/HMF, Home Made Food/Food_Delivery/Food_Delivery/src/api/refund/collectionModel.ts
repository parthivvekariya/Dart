import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export const TABLE_NAME = 'ip-collections';
export type Collection = z.infer<typeof CollectionSchema>;
export const CollectionSchema = z.object({
  collectionId: z.string(),
  instapostId: z.string(),
  tickerName: z.string(),
  bondingCurveAddress: z.string(),
  tokenAddress: z.string(),
  creator: z.string(),
  complete: z.boolean().optional(),
  raydiumPool: z.string().optional(),
  tradingStatus: z.string(),
  trendingStatus: z.string(),
  tokenVolume: z.number(),
  lastTradedPrice: z.number().optional(),
  lastUpdatedVolumeTimestamp: z.number().optional(),
  virtualSolReserves: z.string().optional(),
  virtualTokenReserves: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const GetCollectionSchema = z.object({
  query: z.object({
    query: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
});

// Input Validation for 'GET admin/:id' endpoint
export const GetCollectionByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

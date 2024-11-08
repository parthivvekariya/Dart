import { StatusCodes } from 'http-status-codes';

import { Collection } from '@/api/refund/collectionModel';
import { collectionRepository } from '@/api/refund/collectionRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

interface SearchParams {
  query?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  lastEvaluatedKey?: any;
}

export const collectionService = {
  getLatestMints: async (): Promise<ServiceResponse<Collection[] | null>> => {
    try {
      const collection = await collectionRepository.findLatestMints();
      if (!collection) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Collection found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Collection[]>(ResponseStatus.Success, 'Collection found', collection, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all collection: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getTrendingMints: async (): Promise<ServiceResponse<Collection[] | null>> => {
    try {
      const collection = await collectionRepository.getTrendingCollections();
      if (!collection) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Collection found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Collection[]>(ResponseStatus.Success, 'Collection found', collection, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all collection: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findAll: async (
    sortBy?: string,
    limit?: number,
    offset?: { collectionId: string; lastTradedPrice?: number; createdAt?: string }
  ): Promise<ServiceResponse<Collection[] | null>> => {
    try {
      const collection = await collectionRepository.findAllAsync(sortBy, limit, offset);
      if (!collection) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Collection found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Collection[]>(ResponseStatus.Success, 'Collection found', collection, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all collection: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getMintsByIdList: async (collectionIdList: string[]): Promise<ServiceResponse<Collection[] | null>> => {
    try {
      if (typeof collectionIdList !== 'object') {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid request body', null, StatusCodes.NOT_FOUND);
      }
      const collection = await collectionRepository.findAllByIdsAsync(collectionIdList);
      if (!collection) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Collection found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Collection[]>(ResponseStatus.Success, 'Collection found', collection, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all collection: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string): Promise<ServiceResponse<Collection | null>> => {
    try {
      const collection = await collectionRepository.findByIdAsync(id);
      if (!collection) {
        return new ServiceResponse(ResponseStatus.Failed, 'Collection not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Collection>(ResponseStatus.Success, 'Collection found', collection, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding collection with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  searchCommunity: async (params: SearchParams): Promise<ServiceResponse<Collection[] | null>> => {
    try {
      const result = await collectionRepository.searchAsync(params);

      if (!result.Items || result.Items.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No collections found', null, StatusCodes.NOT_FOUND);
      }
      const collections = result.Items as Collection[];

      return new ServiceResponse<Collection[]>(
        ResponseStatus.Success,
        'Collections found',
        collections,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error searching collections: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createCollection: async (payload: any): Promise<ServiceResponse<Collection | null>> => {
    try {
      const collection = await collectionRepository.insertRecordAsync(payload);

      return new ServiceResponse<any>(ResponseStatus.Success, 'Collection Created', collection, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creating collection:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  searchByTagsOrCaptionOrTickerName: async (
    query: string,
    limit?: number,
    offset?: number
  ): Promise<ServiceResponse<Collection[] | null>> => {
    try {
      const result = await collectionRepository.searchByTagsOrCaptionOrTickerNameAsync(query, limit, offset);

      if (!result.Items || result.Items.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No collections found', null, StatusCodes.NOT_FOUND);
      }
      const collections = result.Items as Collection[];

      return new ServiceResponse<Collection[]>(
        ResponseStatus.Success,
        'Collections found',
        collections,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error searching collections: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

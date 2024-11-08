import { StatusCodes } from 'http-status-codes';

import { News } from '@/api/admin/newsModel';
import { newsRepository } from '@/api/admin/newsRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const newsService = {
  // Retrieves all admin from the database
  findAll: async (): Promise<ServiceResponse<News[] | null>> => {
    try {
      const news = await newsRepository.findAllAsync();
      if (!news) {
        return new ServiceResponse(ResponseStatus.Failed, 'No News found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<News[]>(ResponseStatus.Success, 'News found', news, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all news: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves single admin by their ID
  findById: async (id: number): Promise<ServiceResponse<News | null>> => {
    try {
      const news = await newsRepository.findByIdAsync(id);
      if (!news) {
        return new ServiceResponse(ResponseStatus.Failed, 'News not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<News>(ResponseStatus.Success, 'News found', news, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding news with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Creates a new admin
  create: async (news: News): Promise<ServiceResponse<News | null>> => {
    try {
      const newNews = await newsRepository.createAsync(news);
      if (!newNews) {
        return new ServiceResponse(ResponseStatus.Failed, 'News not created', null, StatusCodes.BAD_REQUEST);
      }
      return new ServiceResponse<News>(ResponseStatus.Success, 'News created', newNews, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating news: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

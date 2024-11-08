import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import { Restaurant } from '@/api/restaurant/restaurantModel';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { restaurantRepository } from './restaurantRepository';

interface SearchParams {
  location?: string;
  cuisineType?: string;
  rating?: number;
  sortBy?: 'asc' | 'desc';
  limit?: number;
  lastEvaluatedKey?: any;
}

export const restaurantService = {
  findAll: async (): Promise<ServiceResponse<Restaurant[] | null>> => {
    try {
      const restaurants = await restaurantRepository.findAllAsync();
      if (!restaurants || restaurants.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No restaurants found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Restaurant[]>(
        ResponseStatus.Success,
        'restaurants found',
        restaurants,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all restaurants: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findById: async (restaurantId: string): Promise<ServiceResponse<Restaurant | null>> => {
    try {
      const restaurant = await restaurantRepository.findByIdAsync(restaurantId);
      if (!restaurant) {
        return new ServiceResponse(ResponseStatus.Failed, 'Restaurant not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Restaurant>(ResponseStatus.Success, 'Restaurant found', restaurant, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding restaurant with given id: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  search: async (params: SearchParams): Promise<ServiceResponse<Restaurant[] | null>> => {
    try {
      const filter: Record<string, any> = {};

      if (params.location) {
        filter['location'] = {
          [Op.like]: `%${params.location}%`,
        };
      }

      if (params.cuisineType) {
        filter['cuisineType'] = {
          [Op.like]: `%${params.cuisineType}%`,
        };
      }

      if (params.rating) {
        filter['rating'] = {
          [Op.gte]: params.rating,
        };
      }

      const result = await restaurantRepository.searchAsync(filter);

      if (!result || result.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No restaurants found', null, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse<Restaurant[]>(ResponseStatus.Success, 'Restaurants found', result, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error searching restaurants: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

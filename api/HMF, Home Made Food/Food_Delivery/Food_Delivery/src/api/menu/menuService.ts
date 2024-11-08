import { StatusCodes } from 'http-status-codes';

import { Menu } from '@/api/menu/menuModel';
import { menuRepository } from '@/api/menu/menuRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

interface SearchParams {
  query?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  lastEvaluatedKey?: any;
}

export const menuService = {
  getByRestaurantId: async (restaurantId: string): Promise<ServiceResponse<Menu[] | null>> => {
    try {
      const menus = await menuRepository.getByRestaurantIdAsync(restaurantId);
      if (!menus || menus.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No menus found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Menu[]>(ResponseStatus.Success, 'Menus found', menus, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding menus for restaurant: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getById: async (menuId: string): Promise<ServiceResponse<Menu | null>> => {
    try {
      const menu = await menuRepository.getByIdAsync(menuId);
      if (!menu) {
        return new ServiceResponse(ResponseStatus.Failed, 'Menu not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Menu>(ResponseStatus.Success, 'Menu found', menu, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding menu with given id: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

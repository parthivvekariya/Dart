import { StatusCodes } from 'http-status-codes';

import { User } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import sequelize from '@/common/helpers/database';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const userService = {
  findById: async (id: string): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateProfile: async (userId: string, payload: Record<string, any>): Promise<ServiceResponse> => {
    const transaction = await sequelize.transaction();
    try {
      const checkUser = await userRepository.findByIdAsync(userId);
      if (!checkUser) {
        await transaction.rollback();
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }

      await userRepository.updateAsync(userId, payload, transaction);

      await transaction.commit();
      return new ServiceResponse(ResponseStatus.Success, 'User profile updated', null, StatusCodes.OK);
    } catch (ex) {
      await transaction.rollback();
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

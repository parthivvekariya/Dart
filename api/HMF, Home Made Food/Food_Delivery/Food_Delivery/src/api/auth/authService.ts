import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { authRepository } from '@/api/auth/authRepository';
import { User } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import sequelize from '@/common/helpers/database';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';
import { logger } from '@/server';

export const authService = {
  signup: async (userDetails: User & { password: string }): Promise<ServiceResponse<{ userId: string } | null>> => {
    const transaction = await sequelize.transaction();
    try {
      const checkUser = await userRepository.findByEmailAsync(userDetails.email);

      if (checkUser) {
        await transaction.rollback();
        return new ServiceResponse(ResponseStatus.Failed, 'User already exists', null, StatusCodes.CONFLICT);
      }

      userDetails['passwordHash'] = await bcrypt.hash(userDetails.password, env.SALT_ROUNDS);

      const user = await authRepository.signupAsync(userDetails, transaction);

      if (!user) {
        await transaction.rollback();
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Cannot create user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      await transaction.commit();

      return new ServiceResponse<{ userId: string }>(
        ResponseStatus.Success,
        'User created successfully',
        { userId: user.userId },
        StatusCodes.CREATED
      );
    } catch (error) {
      await transaction.rollback();
      const errorMessage = `Error authenticating user: $${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  login: async (
    email: string,
    password: string
  ): Promise<ServiceResponse<{ token: string; userId: string } | null>> => {
    const transaction = await sequelize.transaction();
    try {
      const user = await userRepository.findByEmailAsync(email);

      if (!user) {
        await transaction.rollback();
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        await transaction.rollback();
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid credentials', null, StatusCodes.UNAUTHORIZED);
      }

      await authRepository.updateLastLoginAsync(user.userId, transaction);

      await transaction.commit();
      const token = jwt.sign(
        {
          userId: user.userId,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE_TIME }
      );
      return new ServiceResponse<{ token: string; userId: string }>(
        ResponseStatus.Success,
        'Authentication successfully',
        { token, userId: user.userId },
        StatusCodes.OK
      );
    } catch (error) {
      await transaction.rollback();
      const errorMessage = `Error authenticating user: $${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  forgetPassword: async (email: string): Promise<ServiceResponse> => {
    const transaction = await sequelize.transaction();
    try {
      const checkUser = await userRepository.findByEmailAsync(email);

      if (!checkUser) {
        await transaction.rollback();
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }

      await authRepository.forgetPasswordAsync(email, transaction);

      await transaction.commit();
      return new ServiceResponse<null>(ResponseStatus.Success, 'Authentication successfully', null, StatusCodes.OK);
    } catch (error) {
      await transaction.rollback();
      const errorMessage = `Error authenticating user: $${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

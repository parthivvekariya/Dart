import { StatusCodes } from 'http-status-codes';

import { Review } from '@/api/review/reviewModel';
import { reviewRepository } from '@/api/review/reviewRepository';
import sequelize from '@/common/helpers/database';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

interface SearchParams {
  query?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  lastEvaluatedKey?: any;
}

export const reviewService = {
  getByRestaurantId: async (restaurantId: string): Promise<ServiceResponse<Review[] | null>> => {
    try {
      const reviews = await reviewRepository.getByRestaurantIdAsync(restaurantId);
      if (!reviews || reviews.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No reviews found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Review[]>(ResponseStatus.Success, 'Reviews found', reviews, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding reviews for restaurant: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createReview: async (review: Review): Promise<ServiceResponse<Review | null>> => {
    const transaction = await sequelize.transaction();
    try {
      const newReview = await reviewRepository.createReviewAsync(review, transaction);
      await transaction.commit();
      return new ServiceResponse<Review>(ResponseStatus.Success, 'Review created', newReview, StatusCodes.CREATED);
    } catch (ex) {
      await transaction.rollback();
      const errorMessage = `Error creating review: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

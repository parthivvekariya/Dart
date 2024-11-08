import { Transaction } from 'sequelize';

import { Review } from '@/api/review/reviewModel';

export const reviewRepository = {
  createReviewAsync: async (review: Review, transaction: Transaction): Promise<Review> => {
    const payload = {
      restaurantId: review.restaurantId,
      userId: review.userId,
      rating: review.rating,
      review: review.review,
    };
    const newReview = await Review.create(payload, { transaction });
    return newReview;
  },

  getByRestaurantIdAsync: async (restaurantId: string): Promise<Review[] | null> => {
    const reviews = await Review.findAll({ where: { restaurantId } });
    return reviews;
  },
};

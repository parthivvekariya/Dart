import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import sequelize from '@/common/helpers/database';

extendZodWithOpenApi(z);

export const ReviewSchema = z.object({
  reviewId: z.string(),
  hotelId: z.string(),
  userId: z.string(),
  rating: z.number(),
  review: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.date().optional(),
});

export class Review extends Model {
  declare reviewId: string;
  declare restaurantId: string;
  declare userId: string;
  declare rating: number;
  declare review: string;
}

Review.init(
  {
    reviewId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.UUID,
    },
    userId: {
      type: DataTypes.UUID,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    review: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize,
  }
);

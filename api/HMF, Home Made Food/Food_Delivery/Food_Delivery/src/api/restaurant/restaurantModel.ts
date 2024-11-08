import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { Menu } from '@/api/menu/menuModel';
import { Review } from '@/api/review/reviewModel';
import sequelize from '@/common/helpers/database';

extendZodWithOpenApi(z);

export const RestaurantScheme = z.object({
  restaurantId: z.string(),
  name: z.string(),
  location: z.string(),
  cuisineType: z.string(),
  menu: z.array(
    z.object({
      menuId: z.string(),
      name: z.string(),
      price: z.number(),
      description: z.string(),
    })
  ),
  rating: z.number(),
  reviews: z.array(
    z.object({
      userId: z.string(),
      rating: z.number(),
      review: z.string(),
    })
  ),
  contactInfo: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  logo: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.date().optional(),
});

export class Restaurant extends Model {
  declare restaurantId: string;
  declare name: string;
  declare location: string;
  declare cuisineType: string;
  declare rating: number;
  declare contactInfo: string;
  declare openTime: string;
  declare closeTime: string;
  declare logo: string;
}

Restaurant.init(
  {
    restaurantId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    cuisineType: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    contactInfo: {
      type: DataTypes.STRING,
    },
    openTime: {
      type: DataTypes.STRING,
    },
    closeTime: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize,
  }
);

Restaurant.hasMany(Menu, { foreignKey: 'restaurantId' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

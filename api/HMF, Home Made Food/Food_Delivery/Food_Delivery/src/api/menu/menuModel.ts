import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import sequelize from '@/common/helpers/database';

extendZodWithOpenApi(z);

export const MenuSchema = z.object({
  menuId: z.string(),
  hotelId: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.date().optional(),
});

export class Menu extends Model {
  declare menuId: string;
  declare name: string;
  declare price: number;
  declare description: string;
}

Menu.init(
  {
    menuId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize,
  }
);

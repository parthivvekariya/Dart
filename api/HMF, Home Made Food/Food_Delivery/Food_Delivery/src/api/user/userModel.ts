import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import sequelize from '@/common/helpers/database';
import { USER_TYPE } from '@/common/utils/enums';

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: z.string().default(USER_TYPE.USER).optional(),
  passwordHash: z.string(),
  address: z.string(),
  profilePic: z.string().optional().nullable(),
  lastLogin: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.date().optional().nullable(),
});

export class User extends Model {
  declare userId: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare passwordHash: string;
  declare address: string;
  declare profilePic: string;
  declare role: string;
  declare lastLogin: string;
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    profilePic: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: USER_TYPE.USER,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize,
  }
);

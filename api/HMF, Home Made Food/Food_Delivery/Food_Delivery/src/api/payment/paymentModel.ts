import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import sequelize from '@/common/helpers/database';

extendZodWithOpenApi(z);

export const PaymentSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  userId: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
  status: z.string(),
  transactionId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.date().optional().nullable(),
});

export class Payment extends Model {
  declare paymentId: string;
  declare amount: number;
  declare paymentMethod: string;
  declare status: string;
  declare transactionId: string;
}

Payment.init(
  {
    paymentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    transactionId: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize,
  }
);

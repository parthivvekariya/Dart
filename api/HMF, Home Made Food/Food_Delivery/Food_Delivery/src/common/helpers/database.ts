import mysql2 from 'mysql2';
import { Options, Sequelize } from 'sequelize';

import { env } from '@/common/utils/envConfig';

const options = {
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  dialect: 'mysql',
  dialectModule: mysql2,
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  logging: false,
} as Options;

const sequelize = new Sequelize(options);

void sequelize.sync({ alter: true });

export default sequelize;

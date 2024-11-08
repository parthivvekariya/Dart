import dotenv from 'dotenv';
import { bool, cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  DB_NAME: str({ devDefault: testOnly('FOOD_DELIVERY') }),
  DB_USER: str({ devDefault: testOnly('root') }),
  DB_PASSWORD: str({ devDefault: testOnly('123456') }),
  DB_HOST: str({ devDefault: testOnly('localhost') }),
  DB_PORT: str({ devDefault: testOnly('3306') }),
  JWT_SECRET: str({ devDefault: testOnly('my-jwt-secret') }),
  JWT_EXPIRE_TIME: num({ devDefault: testOnly(86400) }),
  SALT_ROUNDS: num({ devDefault: testOnly(10) }),
  IS_PRODUCTION: bool({ devDefault: testOnly(false) }),
});

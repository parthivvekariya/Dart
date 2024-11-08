import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';

interface JWTToken extends JwtPayload {
  publicKey: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const errorMessage = 'Token not found';
      const statusCode = StatusCodes.UNAUTHORIZED;
      return res
        .status(statusCode)
        .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    }
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTToken;
    const userId = payload.userId;

    const user = userRepository.findByIdAsync(userId);

    if (!user) {
      const errorMessage = 'User not found';
      const statusCode = StatusCodes.NOT_FOUND;
      return res
        .status(statusCode)
        .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    }

    req.headers['x-user-id'] = userId;
    next();
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      const errorMessage = 'Token has expired';
      const statusCode = StatusCodes.UNAUTHORIZED;
      return res
        .status(statusCode)
        .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    }
    const errorMessage = err.message;
    const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
  }
};

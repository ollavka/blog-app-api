import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/ApiError';
import { jwtService } from '../services/jwtService';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = '' } = req.headers;

  const [, accessToken] = authorization.split(' ');

  if (!authorization || !accessToken) {
    throw ApiError.Unauthorized();
  }

  const userData = jwtService.verifyAccessToken(accessToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  next();
};

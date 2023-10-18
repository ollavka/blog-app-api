import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/ApiError';

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    const { status, errors, message } = error;

    res.status(status).send({ message, errors });
  }

  res.sendStatus(500).send({ message: 'Intenal server error', errors: {} });
};

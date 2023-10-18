import { Request, Response } from 'express';
import { ApiError } from '../exceptions/ApiError';
import { validateCredentials } from '../utils/validateCredentials';
import { UserCredentials } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { prisma } from '../prisma/client';

const registration = async (req: Request, res: Response) => {
  const { email = '', password = '', username = '' } = req.body as UserCredentials;

  const { errors, hasError } = validateCredentials({ email, password, username });

  if (hasError) {
    throw ApiError.BadRequest('Validation error', errors);
  }

  await authService.registration({ email, password, username });

  res.status(201).send({ success: true });
};

const login = async (req: Request, res: Response) => {
  const { email = '', password = '' } = req.body as Omit<UserCredentials, 'username'>;
  const { errors, hasError } = validateCredentials({ email, password });

  if (hasError) {
    throw ApiError.BadRequest('Validation error', errors);
  }

  await authService.login(res, { email, password });
};

const refresh = async (req: Request, res: Response) => {
  const { refreshToken = '' } = req.cookies;

  await authService.refresh(res, refreshToken);
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken');

  res.sendStatus(204);
};

const activate = async (req: Request, res: Response) => {
  const { activationToken } = req.params;

  const user = await userService.findByToken(activationToken);

  if (!user) {
    throw ApiError.NotFound();
  }

  await prisma.user.update({
    where: { activationToken },
    data: { activationToken: null },
  });

  res.send({ success: true });
};

export const authController = {
  registration,
  login,
  refresh,
  logout,
  activate,
};

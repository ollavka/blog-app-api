import { prisma } from '../prisma/client';
import { ApiError } from '../exceptions/ApiError';
import { UserCredentials } from '../types';
import { jwtService } from './jwtService';
import { normalizeUser } from '../dto/normalizeUser';
import { userService } from './userService';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { tokenService } from './tokenService';
import { emailService } from './emailService';
import { v4 as uuidv4 } from 'uuid';

const registration = async (userData: UserCredentials) => {
  const { email, password, username } = userData;

  await userService.checkUser(email, username);

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationToken = uuidv4();

  await prisma.user.create({
    data: {
      ...userData,
      activationToken,
      password: hashedPassword,
    },
  });

  await emailService.sendActivationLink(email, activationToken);
};

const login = async (res: Response, credentials: Omit<UserCredentials, 'username'>) => {
  const { email, password } = credentials;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password is wrong');
  }

  await sendAuthentification(res, user);
};

const refresh = async (res: Response, refreshToken: string) => {
  const userData = jwtService.verifyRefreshToken(refreshToken) as (User | null);
  const tokenFromDB = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!userData || !tokenFromDB) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.findByEmail(userData.email) as User;

  await sendAuthentification(res, user);
};

const logout = (refreshToken: string) => {
  const userData = jwtService.verifyRefreshToken(refreshToken) as (User | null);

  if (!userData) {
    return;
  }

  tokenService.remove(userData.id);
};

const sendAuthentification = async (res: Response, user: User) => {
  const normalizedUser = normalizeUser(user);
  const accessToken = jwtService.createAccessToken(normalizedUser);
  const refreshToken = jwtService.createRefreshToken(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.send({
    user: normalizedUser,
    accessToken,
  });
};

export const authService = {
  registration,
  login,
  refresh,
  logout,
};

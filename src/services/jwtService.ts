import { NormalizedUser } from '../dto/normalizeUser';
import jwt from 'jsonwebtoken';

const accessTokenKey = process.env.JWT_ACCESS_KEY as string;
const refreshTokenKey = process.env.JWT_REFRESH_KEY as string;

const createAccessToken = (user: NormalizedUser) => {
  const token = jwt.sign(user, accessTokenKey, { expiresIn: '1000s' });

  return token;
};

const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessTokenKey);
  } catch (error) {
    return null;
  }
};

const createRefreshToken = (user: NormalizedUser) => {
  const token = jwt.sign(user, refreshTokenKey, { expiresIn: '30d' });

  return token;
};

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, refreshTokenKey);
  } catch (error) {
    return null;
  }
};

export const jwtService = {
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};

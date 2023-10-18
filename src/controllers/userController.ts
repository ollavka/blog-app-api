import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { normalizeUser } from '../dto/normalizeUser';
import { User } from '@prisma/client';
import { awsService } from '../services/awsService';
import { FileArray, UploadedFile } from 'express-fileupload';
import { jwtService } from '../services/jwtService';
import { ApiError } from '../exceptions/ApiError';
import { prisma } from '../prisma/client';

const getOne = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await userService.findByUsername(username as string) as User;

  res.send(normalizeUser(user));
};

const uploadAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.files as FileArray;
  const { refreshToken } = req.cookies;

  const userData = jwtService.verifyRefreshToken(refreshToken) as (User | null);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const file = avatar as UploadedFile;
  const avatarUrl = await awsService.uploadImage({ file });

  const userFromDB = await userService.findById(userData.id);

  if (!userFromDB) {
    throw ApiError.NotFound();
  }

  if (userFromDB.avatar) {
    const pathParts = userFromDB.avatar.split('/');
    const fileName = pathParts[pathParts.length - 1];

    await awsService.deleteImage(fileName);
  }

  await userService.updateUserAvatar(userData.id, avatarUrl);

  res.status(200).send({ avatarUrl });
}

const update = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { firstName, lastName, username, biography } = req.body;

  if (!username.trim()) {
    throw ApiError.BadRequest('Username is required');
  }

  const userData = jwtService.verifyRefreshToken(refreshToken) as (User | null);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const userFromDB = await userService.findByUsername(username);

  const isUsernameTaken = userFromDB && userFromDB.id !== userData.id;

  if (isUsernameTaken) {
    throw ApiError.BadRequest('This username is already taken');
  }

  await prisma.user.update({
    where: {
      id: userData.id
    },
    data: {
      firstName,
      lastName,
      username,
      biography,
    },
  });

  res.status(200).send({ success: true });
};

export const userController = {
  getOne,
  update,
  uploadAvatar,
};

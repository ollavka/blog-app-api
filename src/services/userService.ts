import { ApiError } from '../exceptions/ApiError';
import { prisma } from '../prisma/client';

const findById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const findByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findByUsername = (username: string) => {
  return prisma.user.findUnique({
    where: { username }
  });
};

const findByToken = (activationToken: string) => {
  return prisma.user.findUnique({
    where: { activationToken }
  });
}

const checkUser = async (email: string, username: string) => {
  const foundUserByEmail = await findByEmail(email);
  const foundUserByUsername = await findByUsername(username);

  if (foundUserByEmail) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already taken',
    });
  }

  if (foundUserByUsername) {
    throw ApiError.BadRequest('Validation error', {
      username: 'Username is already taken',
    });
  }
};

const updateUserAvatar = async (userId: string, avatarUrl: string) => {
  await prisma.user.update({
    data: {
      avatar: avatarUrl,
    },
    where: {
      id: userId,
    },
  })
};

export const userService = {
  checkUser,
  findById,
  findByUsername,
  findByEmail,
  findByToken,
  updateUserAvatar,
};

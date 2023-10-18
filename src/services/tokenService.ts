import { prisma } from '../prisma/client';

const save = async (userId: string, token: string) => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { userId },
  });

  if (!refreshToken) {
    await prisma.refreshToken.create({
      data: {
        userId,
        token,
      },
    });

    return;
  }

  await prisma.refreshToken.update({
    where: { userId },
    data: { token },
  });
};

const remove = (userId: string) => {
  return prisma.refreshToken.delete({
    where: { userId },
  });
};

const findByToken = (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
};

export const tokenService = {
  save,
  remove,
  findByToken,
};

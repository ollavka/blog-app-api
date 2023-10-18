import { prisma } from '../prisma/client';

const getPosts = () => {
  return prisma.post.findMany({
    include: {
      user: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getById = (id: string) => {
  return prisma.post.findUnique({
    include: {
      user: true,
      comments: true,
    },
    where: {
      id
    },
  });
};

const getByUserId = (userId: string) => {
  return prisma.post.findMany({
    where: {
      userId
    },
    include: {
      user: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const createPost = async (userId: string, description: string) => {
  return prisma.post.create({
    data: {
      userId,
      description,
    },
    include: {
      user: true,
      comments: true,
    },
  });
};

export const postService = {
  getPosts,
  getById,
  createPost,
  getByUserId,
};

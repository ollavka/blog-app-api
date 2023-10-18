import { prisma } from '../prisma/client';

const getByPostId = (postId: string) => {
  return prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const createComment = async (userId: string, postId: string, message: string) => {
  return prisma.comment.create({
    data: {
      message,
      postId,
      userId,
    },
    include: {
      post: true,
      user: true,
    },
  });
};

export const commentService = {
  getByPostId,
  createComment,
};

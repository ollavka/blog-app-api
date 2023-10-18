import { Post } from '@prisma/client';

export const normalizePost = (post: Post) => {
  const { createdAt, ...rest } = post;

  return rest;
};

export type NormalizePost = ReturnType<typeof normalizePost>;

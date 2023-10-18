import { Request, Response } from 'express';
import { ApiError } from '../exceptions/ApiError';
import { commentService } from '../services/commentService';
import { jwtService } from './../services/jwtService';
import { User } from '@prisma/client';
import { postService } from '../services/postService';

const getAllByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;

  const comments = await commentService.getByPostId(postId);

  res.send(comments);
};

const create = async (req: Request, res: Response) => {
  const { userId, postId, message } = req.body;
  const { refreshToken } = req.cookies;

  if (!userId || !postId || !message) {
    throw ApiError.BadRequest('Invalid data');
  }

  const userData = jwtService.verifyRefreshToken(refreshToken) as (User | null);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  if (userId !== userData.id) {
    throw ApiError.BadRequest('Invalid data');
  }

  const post = await postService.getById(postId);

  if (!post) {
    throw ApiError.BadRequest('Invalid data');
  }

  const comment = await commentService.createComment(userId, postId, message);

  res.send(comment);
};

export const commentsController = {
  getAllByPostId,
  create,
};

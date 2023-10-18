import { Request, Response } from 'express';
import { ApiError } from '../exceptions/ApiError';
import { postService } from '../services/postService';
import { normalizePost } from '../dto/normalizePost';
import { jwtService } from './../services/jwtService';
import { User } from '@prisma/client';

const getAll = async (req: Request, res: Response) => {
  const posts = await postService.getPosts();

  res.send(posts);
};

const getAllByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const posts = await postService.getByUserId(userId);

  res.send(posts);
};

const getOne = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await postService.getById(id);

  if (!post) {
    throw ApiError.NotFound();
  }

  res.send(post);
}

const create = async (req: Request, res: Response) => {
  const { userId, description } = req.body;
  const { refreshToken } = req.cookies;

  if (!userId || !description) {
    throw ApiError.BadRequest('Invalid data');
  }

  const userData = jwtService.verifyRefreshToken(refreshToken) as (User | null);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  if (userId !== userData.id) {
    throw ApiError.BadRequest('Invalid data');
  }

  const post = await postService.createPost(userId, description);

  res.send(post);
};

export const postController = {
  getAll,
  getAllByUser,
  getOne,
  create,
};

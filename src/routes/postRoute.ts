import { Router } from 'express';
import { catchError } from '../utils/catchError';
import { postController } from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const postRouter = Router();

postRouter.get('/', authMiddleware, catchError(postController.getAll));
postRouter.get('/byUser/:userId', authMiddleware, catchError(postController.getAllByUser));
postRouter.get('/:id', authMiddleware, catchError(postController.getOne));
postRouter.post('/', authMiddleware, catchError(postController.create));

import { Router } from 'express';
import { catchError } from '../utils/catchError';
import { authMiddleware } from '../middlewares/authMiddleware';
import { commentsController } from '../controllers/commentsController';

export const commentsRouter = Router();

commentsRouter.get('/:postId', authMiddleware, catchError(commentsController.getAllByPostId));
commentsRouter.post('/', authMiddleware, catchError(commentsController.create));

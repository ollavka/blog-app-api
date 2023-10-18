import { Router } from 'express';
import { catchError } from '../utils/catchError';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = Router();

userRouter.get('/:username', authMiddleware, catchError(userController.getOne));
userRouter.post('/uploadAvatar', authMiddleware, catchError(userController.uploadAvatar));
userRouter.patch('/updateUserData', authMiddleware, catchError(userController.update));

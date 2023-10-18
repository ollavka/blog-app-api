import { Router } from 'express';
import { authController } from '../controllers/authController';
import { catchError } from '../utils/catchError';

export const authRouter = Router();

authRouter.post('/registration', catchError(authController.registration));
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));
authRouter.get('/refresh', catchError(authController.refresh));
authRouter.get('/activation/:activationToken', catchError(authController.activate));

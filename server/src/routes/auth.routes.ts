import express from 'express';
import { authController } from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/currentUser', authController.currentUser);
authRouter.post('/logout', authController.logout);

export default authRouter;
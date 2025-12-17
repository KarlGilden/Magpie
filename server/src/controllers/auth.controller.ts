import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';

const register = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body) return res.status(500).send("No request body");

    try{
        const userId = await authService.register(req.body)
        return res.status(201).send({id: userId});
    }catch (error){
        return next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = await authService.login(req.body);

        req.session.userId = userId;
    
        return res.status(200).send({id: userId})
    }catch (error){
        return next(error);
    }
};

const currentUser = (req: Request, res: Response) => {
    if (!req.session.userId) {
        return res.status(401).send({ message: "Not authenticated" });
    }

    return res.status(200).send({ id: req.session.userId });
};

const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: "Logout failed" });
        }

        res.clearCookie('connect.sid');
        return res.status(200).send({ message: "Logged out" });
    });
};

export const authController = {
    register,
    login,
    currentUser,
    logout
};
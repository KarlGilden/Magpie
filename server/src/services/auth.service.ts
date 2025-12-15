import { Request, Response, NextFunction } from 'express';
import { db } from '../data/db'
import { AppError, SQLError } from '../types/error.types';
import bcrypt from 'bcrypt';
import { Credential, LoginRequest, RegisterRequest, User } from '../types/auth.types';

const register = async (req: RegisterRequest) => {

    if (!req.username || !req.password || !req.email) {
        throw Error("Please enter all required fields");
    }

    const passwordHash = await bcrypt.hash(req.password, 12);

    try{
        const userId = await db.transaction(async (trx) => {
            // 1. Insert user
            const [userId] = await trx<User>("users").insert(
                { email: req.email, username: req.username },
                ["id"] // MySQL >=8 returns inserted id if specified
            );

            // If knex returns plain number instead of object
            const finalUserId = typeof userId === "object" ? userId.id : userId;

            // 2. Insert auth_provider
            const [providerId] = await trx("auth_providers").insert(
                {
                    user_id: finalUserId,
                    provider: "credentials",
                    provider_user_id: String(finalUserId),
                },
                ["id"]
            );

            const finalProviderId =
                typeof providerId === "object" ? providerId.id : providerId;

            // 3. Insert credentials
            await trx("credentials").insert({
                provider_id: finalProviderId,
                password_hash: passwordHash,
            });

            return finalUserId;
        });

        return userId;
    }catch(error){
        const sqlError = error as SQLError;
        throw new AppError(sqlError.sqlMessage, 500)
    }
}

const login = async (req: LoginRequest) => {
  const { email, password } = req;

  if (!email || !password) {
    throw new AppError("Email and password required", 401);
  }

  type UserWithCredentials = User & Credential

  try {
    // 1. Get user + credentials hash
    const user = await db("users as u")
      .select<UserWithCredentials>("u.id", "u.email", "u.username", "c.password_hash")
      .join("auth_providers as ap", "u.id", "ap.user_id")
      .join("credentials as c", "ap.id", "c.provider_id")
      .where("ap.provider", "credentials")
      .andWhere("u.email", email)
      .first();

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // 2. Compare password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new AppError("Invalid email or password", 401);
    }

    return { userId: user.id };
    
  } catch (err) {
    console.error(err);
    throw new AppError("Login failed", 401);
  }
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("session: ", req.session)
    if(!req.session.userId){
        throw new AppError("Auth check failed", 401);
    }

    next();
  } catch (err) {
    console.error(err);
    throw new AppError("Auth check failed", 401);
  }
}

export const authService = {
    register,
    login
};
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { NextFunction, Response } from "express";
import { GenericRepsone } from "../interfaces/misc.interface";
import { Config } from "../config";
import { UserService } from "../services/UserService";
import { User } from "../models/User";
import createHttpError from "http-errors";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!Config || !Config.JWT_SECRET) {
    const error = createHttpError(401, "Error retrieving Config variables.");
    return next(error);
  }
  let token;
  if (req.cookies?.jwtToken) {
    token = req.cookies.jwtToken;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = createHttpError(401, "No token found.");
    next(error);
  }

  const decoded = jwt.verify(token, Config.JWT_SECRET!);
  const userService = new UserService(User);

  let userId: string | undefined;
  if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
    userId = (decoded as { userId: string }).userId;
  }

  if (!userId) {
    const error = createHttpError(401, "No userId found.");
    return next(error);
  }

  const user = await userService.findById(userId);
  if (!user) {
    const error = createHttpError(401, "No user found.");
    return next(error);
  }
  req.user = user;
  next();
};

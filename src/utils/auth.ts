import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./ErrorHandler.ts";
import { UserDocument } from "../interfaces/userInterFaces.ts";
import User from "../models/userModel.ts";
export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler(`Unauthorized access`, 401)); // Proceed without setting req.user if there's no token
    }
    const decodedData: any = jwt.verify(token, process.env.JWT_SECRET!);
    const foundUser: UserDocument | null = await User.findById(decodedData._id);
    if (!foundUser) {
      return next(); // Proceed without setting req.user if user isn't found
    }
    req.user = foundUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return next(new ErrorHandler(`Unauthorized access`, 401));
    }

    next();
  };
};

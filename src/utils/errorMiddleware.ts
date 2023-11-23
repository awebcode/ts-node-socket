import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./ErrorHandler.ts"; // Import your ErrorHandler class

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: string;
  path?: string;
  kind?: string;
  errors?: object; // Define the errors property if needed
}

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Wrong Mongodb Id error
  if (err.name === "CastError" && err.path) {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // Reference error
  if (err.name === "ReferenceError") {
    const message = `Reference error occurred: ${err.message}`;
    err = new ErrorHandler(message, 500);
  }

  // Validation error
  if (err.name === "ValidationError" && err.errors) {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    err = new ErrorHandler(message, 400);
  }

  // Invalid ObjectId error
  if (err.name === "CastError" && err.path === "_id" && err.kind === "ObjectId") {
    const message = "Invalid ObjectId";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    success: false,
    statusCode: err.statusCode,
    message: err.message,
  });
};

export default errorMiddleware;

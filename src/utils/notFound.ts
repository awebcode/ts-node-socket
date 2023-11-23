import { NextFunction, Request, Response } from "express";

const notFound=((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found -${req.originalUrl}`);
//   res.status(404).json({ message: 'Route not found' });
  next(error);
})
export default notFound;
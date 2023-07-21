import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err?.message, err?.stack);
  const statusError: number = req.statusCode ?? 500;
  res.status(statusError).json({
    success: false,
    message: err.message,
  });
};

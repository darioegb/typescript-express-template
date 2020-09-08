import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';

export function errorMiddleware(error: HttpException, _req: Request, res: Response, _next: NextFunction) {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  console.error('[ERROR] ', status, message);

  res.status(status).json({ message });
}

import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions';

export function errorMiddleware(
  error: HttpException,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  if (process.env.NODE_ENV !== 'test') {
    console.error('[ERROR] %s', `${status} - ${message}`.red);
  }

  res.status(status).json({ message });
}

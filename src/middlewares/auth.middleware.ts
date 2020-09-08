import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '../exceptions';
import { DataStoredInToken } from '../interfaces/auth.interface';
import { userModel } from '../models';

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const headers = req.headers;

  if (headers && headers.authorization) {
    const secret: string = process.env.JWT_SECRET || 'secretKey';

    try {
      const verificationResponse = verify(headers.authorization, secret) as DataStoredInToken;
      const userId = verificationResponse._id;
      const userExist = userModel.exists({ _id: userId });

      if (userExist) {
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  } else {
    next(new HttpException(404, 'Authentication token missing'));
  }
}

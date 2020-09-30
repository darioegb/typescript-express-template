import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '../exceptions';
import {
  DataStoredInToken,
  RequestWithUser,
} from '../interfaces/auth.interface';
import { userModel } from '../models';

export async function authMiddleware(
  req: RequestWithUser,
  _res: Response,
  next: NextFunction
) {
  const headers = req.headers;

  if (headers && headers.authorization) {
    const secret: string = process.env.JWT_SECRET;

    try {
      let token = headers.authorization;
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      const verificationResponse = verify(token, secret) as DataStoredInToken;
      const _id = verificationResponse._id;
      const findUser = await userModel.findById({ _id }).exec();
      if (findUser) {
        req.user = findUser;
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

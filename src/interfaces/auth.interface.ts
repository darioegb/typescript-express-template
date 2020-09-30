import { Request } from 'express';
import { User } from './';

export interface DataStoredInToken {
  _id: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

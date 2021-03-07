import { Roles } from '@/data/enums';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  role: Roles;
}

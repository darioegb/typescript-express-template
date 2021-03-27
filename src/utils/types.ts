import { UserDto } from '@/data/dtos';
import { User } from '@/data/interfaces';

export type Constructable<
  T extends { [key in keyof T]: unknown } = unknown
> = new (...args: unknown[]) => T;

export type numberOrUndefined = number | undefined;
export type stringOrUndefined = string | undefined;
export type stringsOrUndefined = string[] | undefined;
export type stringOrNumber = string | number;
export type userDtoOrUsersDto = UserDto | UserDto[];
export type userOrUsers = User | User[];
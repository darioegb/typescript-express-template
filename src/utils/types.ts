import { UserDto } from '@dtos';
import { User } from '@interfaces';

export type numberOrUndefined = number | undefined;
export type stringOrUndefined = string | undefined;
export type stringsOrUndefined = string[] | undefined;
export type stringOrNumber = string | number;
export type userDtoOrUsersDto = UserDto | UserDto[];
export type userOrUsers = User | User[];

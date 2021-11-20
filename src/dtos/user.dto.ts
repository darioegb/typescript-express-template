import { IsString, IsEmail, Length, IsEnum, IsNotEmpty } from 'class-validator';
import { Roles } from '@enums';

export class UserDto {
  @IsString()
  @Length(3, 30)
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @Length(3, 30)
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  public role: Roles;
}

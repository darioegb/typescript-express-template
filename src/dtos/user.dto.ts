import { IsString, IsEmail, Length, IsEnum, IsNotEmpty } from 'class-validator';
import { Roles } from '../enums';

export class UserDto {
  constructor(
    _id?: string,
    firstName?: string,
    lastName?: string,
    fullName?: string,
    email?: string,
    password?: string,
    role?: Roles
  ) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  readonly _id!: string;
  readonly fullName: string;

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

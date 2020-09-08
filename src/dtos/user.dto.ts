import { IsString, IsEmail, Length, IsDefined, IsEnum } from 'class-validator';
import { Roles } from '../enums';

export class UserDto {
  
  constructor(
    _id?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    role?: Roles
  ) {
    this._id = _id!;
    this.firstName = firstName!;
    this.lastName = lastName!;
    this.email = email!;
    this.password = password!;
    this.role = role!;
  }
  
  readonly _id!: string;

  @IsString()
  @Length(3, 30)
  @IsDefined()  
  public firstName: string;

  @IsString()
  @Length(3, 30)
  @IsDefined()
  public lastName: string;

  @IsEmail()
  @IsDefined()  
  public email: string;

  @IsString()
  @IsDefined()  
  public password: string;

  @IsEnum(Roles)
  @IsDefined()  
  public role: Roles;

  public img?: string;

}

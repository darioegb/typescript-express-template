import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {

  constructor(
    email: string,
    password: string
  ) {
    this.email = email;
    this.password = password;
  }

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

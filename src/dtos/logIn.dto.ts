import { IsString } from 'class-validator';

export class LogInDto {

  constructor(
    email: string,
    password: string
  ) {
    this.email = email;
    this.password = password;
  }

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

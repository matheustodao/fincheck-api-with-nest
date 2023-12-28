import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

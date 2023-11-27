import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  declare name: string;

  @IsEmail()
  declare email: string;

  @MinLength(6)
  declare password: string;
}

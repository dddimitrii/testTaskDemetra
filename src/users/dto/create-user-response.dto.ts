import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserResponseDto {
  @IsNumber()
  declare id: number;

  @IsString()
  declare name: string;

  @IsEmail()
  declare email: string;
}

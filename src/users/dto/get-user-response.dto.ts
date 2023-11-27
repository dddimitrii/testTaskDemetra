import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class GetUserResponseDto {
  @IsNumber()
  declare id: number;

  @IsString()
  declare name: string;

  @IsEmail()
  declare email: string;

  @IsBoolean()
  declare status: boolean;
}

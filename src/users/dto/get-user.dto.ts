import { IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  declare id: string;
}

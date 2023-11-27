import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/get-user.dto';
import { Response } from 'express';
import { GetUserResponseDto } from './dto/get-user-response.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registration(
    @Body() payload: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response<CreateUserResponseDto>> {
    const newUser = await this.usersService.create(payload);

    return res.status(HttpStatus.OK).send(newUser);
  }

  @Get('get-user-by-id')
  async getUserById(
    @Query() payload: GetUserDto,
    @Res() res: Response,
  ): Promise<Response<GetUserResponseDto>> {
    const { id } = payload;

    const user = await this.usersService.getUser(+id);

    return res
      .status(HttpStatus.OK)
      .send({ statusCode: 200, message: 'SUCCESS', user });
  }
}

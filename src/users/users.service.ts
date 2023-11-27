import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BullService } from '../bull/bull.service';
import { CacheService } from '../cache/cache.service';
import { userDataInCache } from './types';
import { GetUserResponseDto } from './dto/get-user-response.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly bullService: BullService,
    private readonly cacheService: CacheService,
  ) {}

  async create(payload: CreateUserDto): Promise<CreateUserResponseDto> {
    const { name, email, password } = payload;

    const checkExist = await this.checkExist(email);

    if (checkExist) throw new BadRequestException('ERR_USER_EMAIL_EXISTS');

    const hashPassword = await bcrypt.hash(password, 5);

    const createdUser = await this.userRepository.save({
      ...payload,
      password: hashPassword,
    });

    await this.bullService.setUserStatusJob(createdUser.id);

    return { id: createdUser.id, name, email };
  }

  async checkExist(email: string): Promise<boolean> {
    const existUser = await this.userRepository.findOne({
      where: { email },
    });

    return Boolean(existUser);
  }

  async updateUserStatus(id: number): Promise<void> {
    await this.userRepository.update({ id }, { status: true });
  }

  async getUser(id: number): Promise<GetUserResponseDto> {
    const userFromCache = await this.cacheService.getUserFromCache(id);

    if (userFromCache) {
      return {
        id,
        ...userFromCache,
      };
    }

    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'status'],
      where: { id },
    });

    if (!user) throw new BadRequestException('ERR_USER_NOT_FOUND');

    const { name, email, status } = user;

    const userDataInCache: userDataInCache = {
      name,
      email,
      status,
    };

    await this.cacheService.setUserInCache(`user:${id}`, userDataInCache, 1800);

    return user;
  }

  // функция, которая делает запрос с помощью Axios с использованием прокси сервера
  async makeRequestWithProxy(url: string) {
    const proxyConfig = {
      host: '45.196.48.9',
      port: 5435,
      auth: {
        username: 'jtzhwqur',
        password: 'jnf0t0n2tecg',
      },
    };

    const agent = new HttpsProxyAgent(
      `http://${proxyConfig.host}:${proxyConfig.port}`,
      proxyConfig,
    );

    const axiosInstance = axios.create({
      httpsAgent: agent,
    });

    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

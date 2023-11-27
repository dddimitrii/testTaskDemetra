import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BullQueueModule } from '../bull/bull.module';
import { UserProcessor } from './user.processor';
import { CacheModule } from '../cache/cache.module';

@Module({
  providers: [UsersService, UserProcessor],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), BullQueueModule, CacheModule],
})
export class UsersModule {}

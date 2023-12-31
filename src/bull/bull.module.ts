import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullService } from './bull.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'user',
    }),
  ],
  providers: [BullService],
  exports: [BullService],
})
export class BullQueueModule {}

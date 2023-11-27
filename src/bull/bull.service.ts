// bull.service.ts

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {
  constructor(@InjectQueue('user') private readonly userQueue: Queue) {}

  async setUserStatusJob(userId: number): Promise<void> {
    await this.userQueue.add('setUserStatus', { userId }, { delay: 10000 });
  }
}

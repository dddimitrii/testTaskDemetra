import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from './users.service';

@Processor('user')
export class UserProcessor {
  constructor(private readonly userService: UsersService) {}

  @Process('setUserStatus')
  async setUserStatus(job: Job<{ userId: number }>): Promise<void> {
    const { userId } = job.data;
    await this.userService.updateUserStatus(userId);
  }
}

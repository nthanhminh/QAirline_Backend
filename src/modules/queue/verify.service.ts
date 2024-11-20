import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class VerifyService {
  constructor(
    @InjectQueue('verify-email')
    private readonly birthdayQueue: Queue,
  ) {}

  async addVerifyJob(data: any) {
    console.log(data);
    await this.birthdayQueue.add('verify-email', data);
  }
}

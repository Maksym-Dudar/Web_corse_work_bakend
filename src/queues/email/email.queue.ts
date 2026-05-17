import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailQueue {
  queue = new Queue('email', {
    connection: {
      host: 'localhost',
      port: 4200,
    },
  });

  //   async sendWelcome(email: string) {
  //     await this.queue.add('send-welcome', { email });
  //   }
}

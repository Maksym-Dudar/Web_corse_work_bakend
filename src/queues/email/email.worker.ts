import { Worker } from 'bullmq';

const worker = new Worker(
  'email',
  async (job) => {
    // if (job.name === 'send-welcome') {
    // }
  },
  {
    connection: {
      host: 'localhost',
      port: 4200,
    },
  },
);

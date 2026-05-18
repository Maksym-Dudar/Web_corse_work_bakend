import { Worker } from "bullmq";

void new Worker(
  "email",
  async () => {
    // if (job.name === 'send-welcome') {
    // }
  },
  {
    connection: {
      host: "localhost",
      port: 4200,
    },
  },
);

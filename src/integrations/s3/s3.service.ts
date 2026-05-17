// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class S3Service {
//   private client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY!,
//       secretAccessKey: process.env.AWS_SECRET!,
//     },
//   });

// //   async upload(file: Buffer, key: string) {
// //     const command = new PutObjectCommand({
// //       Bucket: process.env.S3_BUCKET,
// //       Key: key,
// //       Body: file,
// //     });

// //     await this.client.send(command);
// //   }
// }

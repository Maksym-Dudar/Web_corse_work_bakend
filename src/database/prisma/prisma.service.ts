import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
			connectionString:
				(process.env.DATABASE_URL as string) ||
				"postgresql://neondb_owner:npg_dRX9ZseCx5Ay@ep-wandering-breeze-alhqucz5.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require",
		});
    super({ adapter });
  }
}

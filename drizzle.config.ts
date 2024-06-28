import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default defineConfig({
  schema: './src/core/database/databaseSchema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: configService.get('MYSQL_HOST'),
    port: configService.get('MYSQL_PORT'),
    user: configService.get('MYSQL_USER'),
    password: configService.get('MYSQL_PASSWORD'),
    database: configService.get('MYSQL_DATABASE'),
  }
})
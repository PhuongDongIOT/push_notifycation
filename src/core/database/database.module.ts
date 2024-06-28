import { Global, Module } from '@nestjs/common';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { DatabaseOptions } from './databaseOptions';
import * as mysql from 'mysql2/promise';
import { DrizzleService } from './drizzle.service';




@Global()
@Module({
  exports: [DrizzleService],
  providers: [
    DrizzleService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        // const connection = await 
        return mysql.createPool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}

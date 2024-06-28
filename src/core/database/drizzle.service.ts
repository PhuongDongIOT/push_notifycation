import { Inject, Injectable } from '@nestjs/common';
import {Pool} from 'mysql2/promise';
import { CONNECTION_POOL } from './database.module-definition';
import { drizzle,  MySql2Database} from "drizzle-orm/mysql2";
// import { databaseSchema } from './databaseSchema';

@Injectable()
export class DrizzleService {
  public db: MySql2Database;
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.db = drizzle(this.pool);
  }
}

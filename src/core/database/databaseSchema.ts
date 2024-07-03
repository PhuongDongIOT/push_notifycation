import { bigint, boolean, varchar, date, timestamp, mysqlTable, uniqueIndex, AnyMySqlColumn } from 'drizzle-orm/mysql-core'
import { relations, SQL, sql } from 'drizzle-orm'

const articles = mysqlTable('articles', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  title: varchar('full_name', { length: 256 }),
  content: varchar('full_name', { length: 256 }),
})

const dailyWarningsDate = mysqlTable('dailyWarningsDate', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  warningDate: date('warningDate').notNull(),
  isDeleted: boolean('isDeleted').default(false),
  dateCreated: timestamp('dateCreated').notNull().defaultNow(),
  dateUpdated: timestamp('dateUpdated').notNull().defaultNow(),
  dateDeleted: timestamp('dateDeleted').notNull().defaultNow(),
},
  (table) => ({
    warningDateUniqueIndex: uniqueIndex('warningDateUniqueIndex').on(table.warningDate),
  }))

const dailyWarningsDateRelations = relations(dailyWarningsDate, ({ many }) => ({
  dailyWarnings: many(dailyWarnings),
}))

const dailyWarnings = mysqlTable('dailyWarnings', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  warningName: varchar('warningName', { length: 256 }).notNull(),
  warningExpiredId: bigint('warningExpiredId', { mode: 'number' }).notNull(),
  warningPreviousExpiredNum: bigint('warningPreviousExpiredNum', { mode: 'number' }).notNull(),
  warningPreviousExpiredId: bigint('warningPreviousExpiredId', { mode: 'number' }).notNull(),
  warningRoad: bigint('dailyWarningsId', { mode: 'number' }).default(0),
  warningRoadLimit: bigint('warningRoadLimit', { mode: 'number' }).default(0),
  dailyWarningsLevelId: bigint('dailyWarningsLevelId', { mode: 'number' }),
  warningType: varchar('warningType', { length: 256 }),
  warningDescription: varchar('warningDescription', { length: 256 }),
  userId: bigint('userId', { mode: 'number' }).notNull(),
  isChecked: boolean('isChecked').default(false),
  isDeleted: boolean('isDeleted').default(false),
  dateCreated: timestamp('dateCreated').notNull().defaultNow(),
  dateUpdated: timestamp('dateUpdated').notNull().defaultNow(),
  dateDeleted: timestamp('dateDeleted').notNull().defaultNow()
})



const dailyWarningsVehicle = mysqlTable('dailyWarningsRoad', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  vehicleName: varchar('vehicleName', { length: 256 }).notNull(),
  isDeleted: boolean('isDeleted').default(false),
  dateCreated: timestamp('dateCreated').notNull().defaultNow(),
  dateUpdated: timestamp('dateUpdated').notNull().defaultNow(),
  dateDeleted: timestamp('dateDeleted').notNull().defaultNow(),
  dailyWarningsId: bigint('dailyWarningsId', { mode: 'number' }).references(() => dailyWarnings.id)
})

const dailyWarningsLevel = mysqlTable('dailyWarningsLevel', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  warningLevel: varchar('warningLevel', { length: 256 }).notNull(),
  isDeleted: boolean('isDeleted').default(false),
  dateCreated: timestamp('dateCreated').notNull().defaultNow(),
  dateUpdated: timestamp('dateUpdated').notNull().defaultNow(),
  dateDeleted: timestamp('dateDeleted').notNull().defaultNow(),
})

const dailyWarningsLevelRelations = relations(dailyWarnings, ({ one }) => ({
  author: one(dailyWarningsLevel, {
    fields: [dailyWarnings.dailyWarningsLevelId],
    references: [dailyWarningsLevel.id],
  }),
}))


const dailyWarningsExpiredRelations = relations(dailyWarnings, ({ one }) => ({
  author: one(dailyWarningsDate, {
    fields: [dailyWarnings.warningExpiredId],
    references: [dailyWarningsDate.id],
  }),
}))

const dailyWarningsPreviousExpiredRelations = relations(dailyWarnings, ({ one }) => ({
  author: one(dailyWarningsDate, {
    fields: [dailyWarnings.warningPreviousExpiredId],
    references: [dailyWarningsDate.id],
  }),
}))


const dailyWarningSends = mysqlTable('dailyWarningSends', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  warningVehicleId: bigint('warningVehicleId', { mode: 'number' }).notNull().references(() => dailyWarningsVehicle.id),
  isSend: boolean('isSend').default(false)
})

const dailyWarningSendsRelations = relations(dailyWarningSends, ({ one }) => ({
  author: one(dailyWarningsVehicle, {
    fields: [dailyWarningSends.warningVehicleId],
    references: [dailyWarningsVehicle.id],
  }),
}))

export const databaseSchema = {
  articles,
  dailyWarningsDate,
  dailyWarningsDateRelations,
  dailyWarnings,
  dailyWarningsExpiredRelations,
  dailyWarningsPreviousExpiredRelations,
  dailyWarningSends,
  dailyWarningSendsRelations,
  dailyWarningsVehicle,
  dailyWarningsLevel,
  dailyWarningsLevelRelations
}

// custom lower function
export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`
}

export {
  articles, dailyWarningsDate, dailyWarningsDateRelations, dailyWarnings, dailyWarningsExpiredRelations,
  dailyWarningsPreviousExpiredRelations, dailyWarningSends, dailyWarningsVehicle, dailyWarningSendsRelations,
  dailyWarningsLevel, dailyWarningsLevelRelations
}

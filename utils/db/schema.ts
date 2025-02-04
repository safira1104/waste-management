import {integer, varchar, pgTable, serial, text, timestamp, jsonb, boolean} from 'drizzle-orm/pg-core'


export const Users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', {length: 255}).notNull().unique(),
    name: varchar('name', {length:255}).notNull(),     
    createAt: timestamp('create_at').defaultNow().notNull()
})

export const Report = pgTable('report', {
    id: serial('id').primaryKey(),
    userId:integer('user_id').references(() => Users.id).notNull(),
    location: text('location').notNull(),
    wasteType: varchar('waste_type', {length:255}).notNull(),
    amount: varchar('amount', {length:255}).notNull(),
    verificationResult: jsonb('verification_result'),
    status: varchar('status',{length:255}).notNull().default('pending'),
    createAt: timestamp('create_at').defaultNow().notNull(),
    collectorId: integer('collector_id').references(() => Users.id),
})

export const Rewards = pgTable('rewards', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    points: integer('points').notNull().default(0),
    createAt: timestamp('create_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
    description: text('description'),
    name: varchar('name', {length:255}).notNull(),
    collectionInfo: text('collection_info').notNull(),

})

export const CollectedWaste = pgTable('collected_waste', {
    id: serial('id').primaryKey(),
    reportId: integer('report_id').references(() => Report.id).notNull(),
    collectorId: integer('collector_id').references(() => Users.id).notNull(),
    CollectionDate: timestamp('collection_date').notNull(),
    status: varchar('status', {length:255}).notNull().default('collected'),
})

export const Notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    message: text('message').notNull(),
    type: varchar('type', {length:50}).notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createAt: timestamp('created_at').defaultNow().notNull(),   
})

 export const Transactions = pgTable( 'transactions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    type: varchar('type', {length:20}).notNull(),
    amount: integer('amount').notNull(),
    description: text('description').notNull(),
    date: timestamp('date').defaultNow().notNull(),
 })
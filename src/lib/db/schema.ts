import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  uuid,
  pgEnum,
  jsonb,
  date,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const roleEnum = pgEnum('role', ['admin', 'petugas'])
export const metodeBayarEnum = pgEnum('metode_bayar', ['tunai', 'transfer'])
export const actionEnum = pgEnum('action', ['create', 'update', 'delete', 'login', 'logout'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  namaLengkap: varchar('nama_lengkap', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('petugas'),
  noTelp: varchar('no_telp', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: uuid('created_by'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const penabung = pgTable('penabung', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull().unique(),
  totalSaldo: decimal('total_saldo', { precision: 15, scale: 2 }).notNull().default('0'),
  statusLunas: boolean('status_lunas').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: uuid('created_by').references(() => users.id),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => users.id),
})

export const transaksi = pgTable('transaksi', {
  id: uuid('id').defaultRandom().primaryKey(),
  penabungId: uuid('penabung_id').notNull().references(() => penabung.id, { onDelete: 'cascade' }),
  nominal: decimal('nominal', { precision: 15, scale: 2 }).notNull(),
  metodeBayar: metodeBayarEnum('metode_bayar').notNull(),
  tanggal: date('tanggal').notNull().defaultNow(),
  petugasId: uuid('petugas_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const penarikanQurban = pgTable('penarikan_qurban', {
  id: uuid('id').defaultRandom().primaryKey(),
  penabungId: uuid('penabung_id').notNull().references(() => penabung.id),
  tahunPeriode: integer('tahun_periode').notNull(),
  jumlahOrang: integer('jumlah_orang').notNull(),
  nominalPerOrang: decimal('nominal_per_orang', { precision: 15, scale: 2 }).notNull(),
  totalPenarikan: decimal('total_penarikan', { precision: 15, scale: 2 }).notNull(),
  tanggalProses: date('tanggal_proses').notNull().defaultNow(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const pengaturan = pgTable('pengaturan', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => users.id),
})

export const activityLog = pgTable('activity_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  userRole: roleEnum('user_role'),
  action: actionEnum('action').notNull(),
  tableName: varchar('table_name', { length: 50 }).notNull(),
  recordId: uuid('record_id'),
  description: text('description'),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many, one }) => ({
  transaksiCreated: many(transaksi),
  penabungCreated: many(penabung, { relationName: 'createdBy' }),
  penabungUpdated: many(penabung, { relationName: 'updatedBy' }),
  penarikanQurban: many(penarikanQurban),
  activityLogs: many(activityLog),
  creator: one(users, {
    fields: [users.createdBy],
    references: [users.id],
  }),
}))

export const penabungRelations = relations(penabung, ({ many, one }) => ({
  transaksi: many(transaksi),
  penarikanQurban: many(penarikanQurban),
  creator: one(users, {
    fields: [penabung.createdBy],
    references: [users.id],
    relationName: 'createdBy',
  }),
  updater: one(users, {
    fields: [penabung.updatedBy],
    references: [users.id],
    relationName: 'updatedBy',
  }),
}))

export const transaksiRelations = relations(transaksi, ({ one }) => ({
  penabung: one(penabung, {
    fields: [transaksi.penabungId],
    references: [penabung.id],
  }),
  petugas: one(users, {
    fields: [transaksi.petugasId],
    references: [users.id],
  }),
}))

export const penarikanQurbanRelations = relations(penarikanQurban, ({ one }) => ({
  penabung: one(penabung, {
    fields: [penarikanQurban.penabungId],
    references: [penabung.id],
  }),
  creator: one(users, {
    fields: [penarikanQurban.createdBy],
    references: [users.id],
  }),
}))

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}))
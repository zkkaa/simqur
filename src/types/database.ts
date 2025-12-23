import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  users,
  penabung,
  transaksi,
  penarikanQurban,
  pengaturan,
  activityLog,
} from '@/lib/db/schema'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type UserRole = 'admin' | 'petugas'

export type Penabung = InferSelectModel<typeof penabung>
export type NewPenabung = InferInsertModel<typeof penabung>

export type Transaksi = InferSelectModel<typeof transaksi>
export type NewTransaksi = InferInsertModel<typeof transaksi>
export type MetodeBayar = 'tunai' | 'transfer'

export type PenarikanQurban = InferSelectModel<typeof penarikanQurban>
export type NewPenarikanQurban = InferInsertModel<typeof penarikanQurban>

export type Pengaturan = InferSelectModel<typeof pengaturan>
export type NewPengaturan = InferInsertModel<typeof pengaturan>

export type ActivityLog = InferSelectModel<typeof activityLog>
export type NewActivityLog = InferInsertModel<typeof activityLog>
export type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout'

export type TransaksiWithRelations = Transaksi & {
  penabung: Penabung
  petugas: User
}

export type PenabungWithTransaksi = Penabung & {
  transaksi: Transaksi[]
}

export type UserWithStats = {
  id: string
  email: string
  namaLengkap: string
  noTelp: string | null
  isActive: boolean
  createdAt: Date
  totalTransaksi?: number
  totalNominal?: string
}

export type PetugasWithStats = UserWithStats
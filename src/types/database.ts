import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  users,
  penabung,
  transaksi,
  penarikanQurban,
  pengaturan,
  activityLog,
} from '@/lib/db/schema'

// User Types
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type UserRole = 'admin' | 'petugas'

// Penabung Types
export type Penabung = InferSelectModel<typeof penabung>
export type NewPenabung = InferInsertModel<typeof penabung>

// Transaksi Types
export type Transaksi = InferSelectModel<typeof transaksi>
export type NewTransaksi = InferInsertModel<typeof transaksi>
export type MetodeBayar = 'tunai' | 'transfer'

// Penarikan Qurban Types
export type PenarikanQurban = InferSelectModel<typeof penarikanQurban>
export type NewPenarikanQurban = InferInsertModel<typeof penarikanQurban>

// Pengaturan Types
export type Pengaturan = InferSelectModel<typeof pengaturan>
export type NewPengaturan = InferInsertModel<typeof pengaturan>

// Activity Log Types
export type ActivityLog = InferSelectModel<typeof activityLog>
export type NewActivityLog = InferInsertModel<typeof activityLog>
export type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout'

// Extended types dengan relations
export type TransaksiWithRelations = Transaksi & {
  penabung: Penabung
  petugas: User
}

export type PenabungWithTransaksi = Penabung & {
  transaksi: Transaksi[]
}

// ✅ FIX: Ubah UserWithStats menjadi lebih fleksibel
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

// ✅ NEW: Type khusus untuk Petugas dengan Stats (hasil dari API)
export type PetugasWithStats = UserWithStats
import { db, users, pengaturan } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth/helpers'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Create initial admin user
    const hashedPassword = await hashPassword('admin123')
    
    await db.insert(users).values({
      email: 'admin@tabunganqurban.com',
      password: hashedPassword,
      namaLengkap: 'Administrator',
      role: 'admin',
      noTelp: '081234567890',
      isActive: true,
    })

    console.log('✅ Admin user created:')
    console.log('   Email: admin@tabunganqurban.com')
    console.log('   Password: admin123')
    console.log('   ⚠️  GANTI PASSWORD SETELAH LOGIN!')

    // Create initial settings
    await db.insert(pengaturan).values([
      {
        key: 'target_qurban',
        value: '3600000', // Rp 3.600.000
      },
      {
        key: 'periode_aktif',
        value: new Date().getFullYear().toString(),
      },
      {
        key: 'nama_rt',
        value: 'RT 01 / RW 01',
      },
    ])

    console.log('✅ Initial settings created')
    console.log('')
    console.log('🎉 Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
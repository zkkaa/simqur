'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useUpdateProfile, useChangePassword } from '@/lib/hooks/use-profile'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import {
  User,
  ArrowLeft,
  PencilSimple,
  LockKey,
  ShieldCheck,
  Envelope,
  Phone,
  CheckCircle,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Validation schemas
const profilSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  noTelp: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
    newPassword: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

type ProfilFormData = z.infer<typeof profilSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()

  const [editMode, setEditMode] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [toast, setToast] = useState<{
    isOpen: boolean
    title: string
    message?: string
    variant: 'success' | 'error'
  }>({
    isOpen: false,
    title: '',
    variant: 'success',
  })

  const {
    register: registerProfil,
    handleSubmit: handleSubmitProfil,
    formState: { errors: errorsProfi },
  } = useForm<ProfilFormData>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      namaLengkap: user?.name || '',
      noTelp: user?.noTelp || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  if (authLoading) {
    return <LoadingPage text="Memuat profil..." />
  }

  const handleUpdateProfile = async (data: ProfilFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        id: user!.id,
        namaLengkap: data.namaLengkap,
        noTelp: data.noTelp || null,
      })
      setEditMode(false)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Profil berhasil diperbarui',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal memperbarui profil',
        variant: 'error',
      })
    }
  }

  const handleChangePassword = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        id: user!.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setShowPasswordForm(false)
      resetPassword()
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Password berhasil diubah',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal mengubah password',
        variant: 'error',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
      />

      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-20 rounded-b-3xl shadow-lg relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft weight="bold" className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Profil</h1>
            <Logo size="md" showText={false} />
          </motion.div>

          {/* Profile Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-12"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
              <User weight="duotone" className="w-12 h-12 text-primary-600" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 mt-16 space-y-4">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheck weight="fill" className="w-5 h-5 text-warning" />
                <span className="text-sm text-warning font-medium uppercase">
                  {user?.role}
                </span>
              </div>
            </div>

            {!editMode ? (
              <>
                {/* Display Mode */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <Envelope
                      weight="duotone"
                      className="w-5 h-5 text-gray-400 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone
                      weight="duotone"
                      className="w-5 h-5 text-gray-400 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">No. Telepon</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.noTelp || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setEditMode(true)}
                  leftIcon={<PencilSimple weight="bold" className="w-5 h-5" />}
                  className="mt-4"
                >
                  Edit Profil
                </Button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <form
                  onSubmit={handleSubmitProfil(handleUpdateProfile)}
                  className="space-y-4 pt-4 border-t border-gray-100"
                >
                  <Input
                    {...registerProfil('namaLengkap')}
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    error={errorsProfi.namaLengkap?.message}
                    leftIcon={<User weight="duotone" className="w-5 h-5" />}
                    required
                  />

                  <Input
                    {...registerProfil('noTelp')}
                    label="No. Telepon"
                    placeholder="08xxxxxxxxxx"
                    error={errorsProfi.noTelp?.message}
                    leftIcon={<Phone weight="duotone" className="w-5 h-5" />}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      onClick={() => setEditMode(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={updateProfileMutation.isPending}
                      leftIcon={
                        <CheckCircle weight="bold" className="w-5 h-5" />
                      }
                    >
                      Simpan
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <LockKey weight="duotone" className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ubah Password</h3>
                <p className="text-xs text-gray-600">
                  Perbarui password Anda
                </p>
              </div>
            </div>

            {!showPasswordForm ? (
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowPasswordForm(true)}
              >
                Ubah Password
              </Button>
            ) : (
              <form
                onSubmit={handleSubmitPassword(handleChangePassword)}
                className="space-y-4"
              >
                <Input
                  {...registerPassword('currentPassword')}
                  type="password"
                  label="Password Lama"
                  placeholder="Masukkan password lama"
                  error={errorsPassword.currentPassword?.message}
                  leftIcon={<LockKey weight="duotone" className="w-5 h-5" />}
                  required
                />

                <Input
                  {...registerPassword('newPassword')}
                  type="password"
                  label="Password Baru"
                  placeholder="Masukkan password baru"
                  error={errorsPassword.newPassword?.message}
                  leftIcon={<LockKey weight="duotone" className="w-5 h-5" />}
                  required
                />

                <Input
                  {...registerPassword('confirmPassword')}
                  type="password"
                  label="Konfirmasi Password"
                  placeholder="Ulangi password baru"
                  error={errorsPassword.confirmPassword?.message}
                  leftIcon={<LockKey weight="duotone" className="w-5 h-5" />}
                  required
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setShowPasswordForm(false)
                      resetPassword()
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={changePasswordMutation.isPending}
                    leftIcon={
                      <CheckCircle weight="bold" className="w-5 h-5" />
                    }
                  >
                    Simpan
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
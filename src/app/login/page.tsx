'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import { SignIn, Eye, EyeSlash, Key, LockKey } from '@phosphor-icons/react'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // GSAP Entrance Animation
  useEffect(() => {
    if (containerRef.current && cardRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      )

      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
      )
    }
  }, [])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setToast({
          isOpen: true,
          title: 'Login Gagal',
          message: result.error,
          variant: 'error',
        })
      } else if (result?.ok) {
        setToast({
          isOpen: true,
          title: 'Login Berhasil',
          message: 'Mengalihkan ke dashboard...',
          variant: 'success',
        })

        // Delay redirect untuk show toast
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh()
        }, 1000)
      }
    } catch (err) {
      setToast({
        isOpen: true,
        title: 'Terjadi Kesalahan',
        message: 'Silakan coba lagi.',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-10 right-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-10 left-10 w-72 h-72 bg-secondary-200 rounded-full blur-3xl opacity-20"
      />

      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
        duration={3000}
      />

      {/* Mobile-First Container: max-w-sm (384px) */}
      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div ref={cardRef} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <Logo size="md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-center text-sm text-gray-600">
              Sistem Manajemen Qurban
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Input
              {...register('email')}
              id="email"
              type="email"
              label="Email"
              placeholder="admin@simqur.com"
              error={errors.email?.message}
              disabled={isLoading}
              leftIcon={<Key weight="duotone" className="w-5 h-5" />}
              required
            />

            <div className="relative">
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                disabled={isLoading}
                leftIcon={<LockKey weight="duotone" className="w-5 h-5" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeSlash weight="duotone" className="w-5 h-5" />
                ) : (
                  <Eye weight="duotone" className="w-5 h-5" />
                )}
              </button>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                leftIcon={<SignIn weight="bold" className="w-5 h-5" />}
                className="mt-6"
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-4 border-t border-gray-100"
          >
            <p className="text-xs text-center text-gray-500">
              Lupa password? Hubungi administrator
            </p>
          </motion.div>
        </div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          SIMQUR v1.0.0 • Desa Sambong Sawah
        </motion.p>
      </div>
    </div>
  )
}
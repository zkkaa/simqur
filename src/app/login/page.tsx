'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Toast from '@/components/common/Toast'
import Logo from '@/components/common/Logo'
// import SplashScreen from '@/components/SplashScreen' // TEMPORARY DISABLE
import { SignIn, Eye, EyeSlash, Key, LockKey } from '@phosphor-icons/react'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/beranda' // ✅ DEFAULT ke /beranda
  const { status } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // const [showSplash, setShowSplash] = useState(true) // DISABLE
  // const [showLogin, setShowLogin] = useState(false) // DISABLE
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

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/beranda')
    }
  }, [status, router])

  // ✅ GSAP Animation on mount
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
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          ease: 'back.out(1.7)' 
        }
      )
    }
  }, [])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      console.log('🔐 Attempting login with:', data.email) // DEBUG

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      console.log('✅ Login result:', result) // DEBUG

      if (result?.error) {
        console.error('❌ Login error:', result.error) // DEBUG
        setToast({
          isOpen: true,
          title: 'Login Gagal',
          message: result.error,
          variant: 'error',
        })
      } else if (result?.ok) {
        console.log('✅ Login successful, redirecting to:', callbackUrl) // DEBUG
        
        setToast({
          isOpen: true,
          title: 'Login Berhasil',
          message: 'Mengalihkan ke dashboard...',
          variant: 'success',
        })

        // Redirect immediately
        setTimeout(() => {
          console.log('🔄 Executing redirect...') // DEBUG
          window.location.href = callbackUrl // ✅ Force full page reload
        }, 1000)
      }
    } catch (err) {
      console.error('❌ Login exception:', err) // DEBUG
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

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-primary-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Memeriksa autentikasi...</p>
        </div>
      </div>
    )
  }

  // Don't render if authenticated
  if (status === 'authenticated') {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden"
    >
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

      <div className="w-full max-w-sm relative z-10">
        <div 
          ref={cardRef} 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Logo size="lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-center text-sm text-gray-600">
              Sistem Manajemen Qurban
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Input
              {...register('email')}
              id="email"
              type="email"
              label="Email"
              placeholder="admin@tabunganqurban.com"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 border-t border-gray-100"
          >
            <p className="text-xs text-center text-gray-500">
              Lupa password? Hubungi administrator
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          Copyright © 2025 Muhammad Azka
        </motion.p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-500 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
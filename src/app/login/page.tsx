'use client'

import { useState, Suspense } from 'react'
import SplashScreen from '@/components/SplashScreen'
import LoginForm from './LoginForm'

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // 1. Tampilkan Splash Screen di awal
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // 2. Bungkus LoginForm dengan Suspense untuk menghindari error build
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-primary-500 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Memuat Halaman...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
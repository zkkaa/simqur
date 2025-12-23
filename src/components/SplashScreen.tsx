'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const router = useRouter()
  const [percent, setPercent] = useState(1)
  const [animationData, setAnimationData] = useState(null)
  const [showFirstText, setShowFirstText] = useState(true)

  useEffect(() => {
    fetch('/json/cow.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Failed to load animation:', err))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstText(false)
    }, 4000) 

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (percent >= 100) {
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }, [percent, onComplete])

  if (!animationData) {
    return (
      <div className="fixed inset-0 z-[9999] bg-primary-500 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="fixed w-screen h-screen flex flex-col items-center justify-center p-6 bg-primary-500 overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-32 left-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"
      />

      <div className="flex flex-col items-center justify-center w-full space-y-8 relative z-10">
        <div className="min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showFirstText ? (
              <motion.div
                key="text1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{
                  duration: 0.6,
                  type: 'spring',
                  bounce: 0.3,
                }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-4xl font-extrabold text-white px-4">
                  Selamat Datang di Simqur
                </h1>
              </motion.div>
            ) : (
              <motion.div
                key="text2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                }}
                className="text-center"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-white px-4 mb-2">
                  Sistem Manajemen Qurban
                </h1>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-base md:text-lg text-primary-100 font-medium"
                >
                  Desa Sambong Sawah
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            scale: { type: 'spring', bounce: 0.4 },
          }}
          className="w-96 h-96 flex items-center justify-center"
        >
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </motion.div>
      </div>

      <div className="absolute bottom-28 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            {percent}%
          </p>
          <div className="w-48 md:w-64 h-2 bg-white/30 rounded-full overflow-hidden mx-auto backdrop-blur-sm">
            <motion.div
              className="h-full bg-white rounded-full shadow-lg"
              initial={{ width: '0%' }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-16 text-xs md:text-sm text-primary-100"
      >
        SIMQUR v1.0.0
      </motion.p>
    </main>
  )
}
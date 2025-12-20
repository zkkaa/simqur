/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimasi untuk production
  swcMinify: true,
  
  // Compress responses
  compress: true,
  
  // Optimasi images (jika nanti ada foto petugas/logo)
  images: {
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
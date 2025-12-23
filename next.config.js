/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  swcMinify: true,
  
  compress: true,
  
  images: {
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
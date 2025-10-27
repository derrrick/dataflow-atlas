import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@antv/l7', '@antv/l7-maps'],
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true, // Temporarily skip TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@antv/l7', '@antv/l7-maps'],
  turbopack: {},
}

export default nextConfig

/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '#ui': path.resolve(__dirname, '../../libs/ui/src'),
    }
    return config
  },
}

module.exports = nextConfig

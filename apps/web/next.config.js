/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: 'standalone',
  // Transpile local workspace package
  transpilePackages: ['@ui'],
}

module.exports = nextConfig

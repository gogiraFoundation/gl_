/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Used by Docker (standalone) and by OpenNext Cloudflare adapter.
  output: 'standalone',
  // Browsers request /favicon.ico by default; public/icon.svg is served at /icon.svg
  async redirects() {
    return [{ source: '/favicon.ico', destination: '/icon.svg', permanent: false }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.gogirlabs.uk',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
}

module.exports = nextConfig

// Bindings for local `next dev` when the OpenNext adapter is installed (devDependency).
if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@opennextjs/cloudflare').initOpenNextCloudflareForDev()
  } catch {
    // Ignore when adapter is not installed (e.g. production Docker image).
  }
}

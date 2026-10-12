import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Don't advertise the stack ("X-Powered-By: Next.js, Payload").
  poweredByHeader: false,
  // Standard browser protections on every page, admin included: no framing by other sites
  // (clickjacking), no MIME sniffing, no full URLs leaked to other sites, no camera/mic/location.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  images: {
    // 75 = default for cards/thumbnails; 90 for full-screen photos (heroes, collage centre).
    qualities: [75, 90],
    // Photos load from the R2 bucket's public address (MEDIA_PUBLIC_URL); /api/media/file/** is
    // the same-origin address used when no bucket is set (local /media folder).
    remotePatterns: process.env.MEDIA_PUBLIC_URL ? [new URL(`${process.env.MEDIA_PUBLIC_URL.replace(/\/$/, '')}/**`)] : [],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

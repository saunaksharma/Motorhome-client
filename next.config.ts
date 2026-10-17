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
  // B2B = the client's Brevo B2B booking page; Partner With Us = the Dream Big page (client).
  async redirects() {
    return [
      { source: '/b2b', destination: 'https://meet.brevo.com/motorhome-adventures/b2b', permanent: false },
      { source: '/partner-with-us', destination: '/dream-big-with-us', permanent: false },
    ]
  },
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
    // On Vercel's free plan the image-resizing quota ran out (new sizes answered 402 → blank
    // photos), so there photos are served as uploaded, straight from R2. On our own server
    // (Hostinger) Next.js resizes them itself with no quota — VERCEL is unset there.
    unoptimized: Boolean(process.env.VERCEL),
    // 75 = default for cards/thumbnails; 90 for full-screen photos (heroes, collage centre).
    qualities: [75, 90],
    // Photos load from the R2 bucket's public address (MEDIA_PUBLIC_URL); /api/media/file/** is
    // the same-origin address used when no bucket is set (local /media folder).
    remotePatterns: process.env.MEDIA_PUBLIC_URL ? [new URL(`${process.env.MEDIA_PUBLIC_URL.replace(/\/$/, '')}/**`)] : [],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      // The site's own brand files (the header wordmark).
      { pathname: '/brand/**' },
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

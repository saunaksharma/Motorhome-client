import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Features } from './collections/Features'
import { CaravanFilterOptions } from './collections/CaravanFilterOptions'
import { TourFilterOptions } from './collections/TourFilterOptions'
import { Caravans } from './collections/Caravans'
import { Tours } from './collections/Tours'
import { Galleries } from './collections/Galleries'
import { BlogCategories } from './collections/BlogCategories'
import { BlogArticles } from './collections/BlogArticles'
import { Reviews } from './collections/Reviews'
import { HeroSlides } from './collections/HeroSlides'
import { Tips } from './collections/Tips'
import { Innovations } from './collections/Innovations'
import { Enquiries } from './collections/Enquiries'
import { Subscribers } from './collections/Subscribers'
import { Pages } from './collections/Pages'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Homepage } from './globals/Homepage'
import { About } from './globals/About'
import { BusinessDetails } from './globals/BusinessDetails'
import { withGlobalRevalidation, withSiteRevalidation } from './hooks/revalidateSite'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// The app's own origin. Set SERVER_URL in production (e.g. https://yourdomain.com).
// Used to lock CORS/CSRF. We intentionally do NOT set Payload's `serverURL` so
// media URLs stay relative (keeps next/image happy without a remote whitelist).
const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
// Extra addresses allowed to use the admin/API (e.g. a temporary preview tunnel),
// comma-separated in EXTRA_ORIGINS. Everything else stays locked out.
const allowedOrigins = [
  serverURL,
  ...(process.env.EXTRA_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
]

// Email turns on only when SMTP details are in .env (works with Gmail app passwords,
// Zoho, etc.). Without them Payload just logs emails to the console — nothing breaks.
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || '',
      defaultFromName: 'Motorhome Adventures',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

// Where each page type lives on the site — feeds the SEO tab's Google preview.
const PAGE_PATH: Record<string, string> = {
  tours: '/tours/',
  caravans: '/caravans/',
  innovations: '/innovations/',
  'blog-articles': '/blog/',
  galleries: '/gallery/',
  pages: '/',
}

const idOf = (value: unknown) => (typeof value === 'object' && value !== null ? (value as { id: number }).id : value)

// SEO tab on every page type, with "auto-generate" buttons that fill the Google
// title/description/image from the page's own content.
const seo = seoPlugin({
  collections: Object.keys(PAGE_PATH),
  uploadsCollection: 'media',
  tabbedUI: true,
  generateTitle: ({ doc }) => doc?.name || doc?.title || '',
  generateDescription: ({ doc }) => doc?.shortDescription || doc?.excerpt || '',
  generateImage: ({ doc }) => (idOf(doc?.heroImage ?? doc?.coverImage) as number) ?? '',
  generateURL: ({ doc, collectionConfig }) =>
    `${serverURL}${PAGE_PATH[collectionConfig?.slug ?? ''] ?? '/'}${doc?.slug ?? ''}`,
})

export default buildConfig({
  plugins: [seo],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  email,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Branded admin: logo, favicon, tab title, welcome panel. Styles in (payload)/custom.css.
    theme: 'light',
    meta: {
      titleSuffix: ' · Motorhome Adventures',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/emblem.png' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
    },
  },
  // Order sets the sidebar order: everyday content first, settings and system last.
  // Anything shown on the public site refreshes it on save (withSiteRevalidation).
  collections: [
    ...[Tours, Caravans, Innovations, BlogArticles, Galleries, Pages, HeroSlides, Reviews, Tips].map(
      withSiteRevalidation,
    ),
    Enquiries,
    Subscribers,
    ...[Features, CaravanFilterOptions, TourFilterOptions, BlogCategories, Media].map(withSiteRevalidation),
    Users,
  ],
  globals: [BusinessDetails, Header, Footer, Homepage, About].map(withGlobalRevalidation),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
})

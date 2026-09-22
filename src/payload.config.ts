import { postgresAdapter } from '@payloadcms/db-postgres'
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
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Homepage } from './globals/Homepage'
import { About } from './globals/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// The app's own origin. Set SERVER_URL in production (e.g. https://yourdomain.com).
// Used to lock CORS/CSRF. We intentionally do NOT set Payload's `serverURL` so
// media URLs stay relative (keeps next/image happy without a remote whitelist).
const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  cors: [serverURL],
  csrf: [serverURL],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Features,
    CaravanFilterOptions,
    TourFilterOptions,
    BlogCategories,
    Caravans,
    Tours,
    Galleries,
    BlogArticles,
    Reviews,
    HeroSlides,
    Tips,
    Innovations,
    Enquiries,
    Subscribers,
  ],
  globals: [Header, Footer, Homepage, About],
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

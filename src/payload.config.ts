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
import { Enquiries } from './collections/Enquiries'
import { Subscribers } from './collections/Subscribers'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
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
    Enquiries,
    Subscribers,
  ],
  globals: [Header, Footer, Homepage],
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

// The public address of the site, used for absolute links: share previews
// (metadataBase), sitemap.xml and robots.txt.
// SERVER_URL wins when it's a real address. A leftover "localhost" value on
// Vercel (copied from .env.example) would put localhost links in every share
// preview, so there we fall back to the production domain Vercel provides.
const configured = process.env.SERVER_URL
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const siteURL =
  configured && !(vercelProduction && configured.includes('localhost'))
    ? configured
    : vercelProduction
      ? `https://${vercelProduction}`
      : 'http://localhost:3000'

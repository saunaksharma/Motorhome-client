import type { Redirect } from 'next/dist/lib/load-custom-routes'

// The client's previous PHP site (same domain) — Google has these addresses indexed. Each old page
// goes, permanently, to its new page; unknown ids fall back to the section. Titles checked against
// the old site on 2026-10-20. (Next passes the old ?id= along; pages set a canonical, so it's harmless.)
const byId = (file: string, ids: Record<string, string>, fallback: string): Redirect[] => [
  ...Object.entries(ids).map(([id, destination]) => ({
    source: `/${file}`,
    has: [{ type: 'query' as const, key: 'id', value: id }],
    destination,
    permanent: true,
  })),
  { source: `/${file}`, destination: fallback, permanent: true },
]

export const oldSiteRedirects: Redirect[] = [
  // fleet.php?id= — caravans and special vehicles (old vehicles no longer listed → Caravans).
  ...byId(
    'fleet.php',
    {
      30: '/caravans/willow',
      31: '/caravans/shiloh',
      33: '/caravans/rambler',
      34: '/caravans/aegis',
      38: '/caravans/harper',
      41: '/caravans/kastro',
      43: '/caravans/reisender-rogue',
      44: '/caravans/aurum',
      24: '/innovations/club-on-wheels',
      26: '/innovations/lounger-on-wheels', // Lounger 1.0
      37: '/innovations/lounger-on-wheels', // Lounger 4.0
      35: '/innovations/vanity-van',
      36: '/innovations/arcade-on-wheels',
      39: '/innovations/food-fusion-express',
    },
    '/caravans',
  ),
  { source: '/fleets.php', destination: '/caravans', permanent: true },

  // item.php?id= — tours.
  ...byId(
    'item.php',
    {
      1: '/tours/the-adventures-of-ladakh',
      2: '/tours/weekend-getaway-to-the-wild',
      3: '/tours/quest-to-uttarakhand',
      4: '/tours/lake-excursion-to-uttarakhand',
      5: '/tours/himalayan-hideout-dharamshala-escape',
      9: '/tours/wildlife-excursion-to-rajasthan',
      10: '/tours/himalayan-escape-to-kumaon', // Ranikhet
      11: '/tours/himalayan-escape-to-kumaon', // Binsar
      12: '/tours/himalayan-escape-to-kumaon', // Kausani
      13: '/tours/mystic-mountains-holy-rivers-the-char-dham-expedition',
      14: '/tours/enchanted-getaway-to-mukteshwar',
    },
    '/tours',
  ),

  // page.php?id= — info pages and blog posts.
  ...byId(
    'page.php',
    {
      1: '/about',
      2: '/contact',
      3: '/disclaimer',
      4: '/privacy-policy',
      5: '/terms-and-conditions',
      6: '/faq', // Guidelines
      7: '/caravans', // Available for rent
      8: '/tours', // Tours for you
      9: '/blog/do-s-don-ts-motorhome-in-india-to-the-adventures-of-ladakh',
      10: '/blog/motorhome-in-india-for-the-adventures-of-ladakh-vehicle-s-look-book',
      11: '/blog/the-adventures-of-ladakh-a-caravan-tour-to-india-s-most-adventurous-route',
      12: '/blog/what-is-a-caravan-motorhome-rv-caravans-in-india',
      13: '/blog/why-should-you-opt-for-a-caravan-for-traveling',
      14: '/blog/what-are-berths-in-caravans',
      15: '/gallery', // Motorhome memories
      16: '/blog/rental-experience-expeditions',
      17: '/blog/how-can-i-rent-a-caravan-in-india',
      19: '/caravans', // Self-driven rental
      21: '/influencer-programme', // Collaborations
    },
    '/',
  ),

  // Galleries and blog lists.
  ...byId('gallery.php', { 1: '/gallery/ladakh-expedition-snaps' }, '/gallery'),
  { source: '/galleries.php', destination: '/gallery', permanent: true },
  { source: '/blogs.php', destination: '/blog', permanent: true },
  { source: '/rss-feeds.php', destination: '/blog', permanent: true },
  { source: '/index.php', destination: '/', permanent: true },
]

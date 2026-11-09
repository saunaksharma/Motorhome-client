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

// Even older sites on this domain (a WordPress site, plain .html/.htm pages, ASP) that Google still
// knows — taken from the Internet Archive's list of the domain's pages (2026-11-09). Each goes to its
// nearest page; leftovers ending .html/.htm/.asp go home. WordPress admin/API, image and script
// addresses are left as 404 (bots and old files — correct for them).
const legacy: Record<string, string[]> = {
  '/about': ['/about-us', '/about.html', '/03_about.html', '/about_motorhome.html', '/aboutus.htm'],
  '/contact': ['/contact-us.php', '/contact.php', '/contact_us.html', '/reachus.htm', '/booking.htm', '/booking1.htm', '/reservation.htm', '/feedback.htm'],
  '/faq': ['/FAQ.html', '/faq.htm', '/guided_tour_booking_info.html'],
  '/terms-and-conditions': ['/terms.html', '/terms_condition.html', '/booking_policy.html'],
  '/blog': ['/10_blog.html', '/single-post.html', '/news', '/uncategorized/hello-world'],
  '/gallery': ['/image-gallery.php', '/our-gallery.php', '/photoview.asp', '/tour-gallery', '/portfolio.html', '/single-project.html'],
  '/caravans': [
    '/11-berth-caravan', '/rentals.html', '/motorhome_rentals.html', '/motorhome_lease.html', '/caravanview.htm',
    '/royal_cadet', '/SLIDING-DRONE', '/towing-trailer-hire.html', '/facility.htm', '/facility1.htm', '/pricing.htm',
    '/two_berth_rental.html', '/four_berth_rental.html', '/five_berth_rental.html', '/six_berth_rental.html',
    '/1_four_berth.html', '/2_four_berth.html', '/3_four_berth.html', '/1_six_berth.html', '/2_six_berth.html', '/3_six_berth.html',
    '/2_berth/:image*', '/5_berth/:image*', '/six_berth/:image*', '/product/:name*',
  ],
  '/build': ['/buy-motor.html', '/buy_sale_motorhome.html', '/buy_sell_customize.html', '/customize_motorhome.html'],
  '/innovations/food-fusion-express': ['/food-truck'],
  '/innovations/lounger-on-wheels': ['/lounger-bus.html'],
  '/tours/the-adventures-of-ladakh': [
    '/lofty-ladakh-9nights10days', '/tour/lofty-ladakh', '/lofty_ladakh_tour.html', '/cultural_ladakh_tour.html',
    '/motorhome_ladakh_tour.html', '/himachal_ladakh_leh.html', '/leh.htm', '/leh1.htm',
  ],
  '/tours/mystic-mountains-holy-rivers-the-char-dham-expedition': ['/char-dham-yatra', '/char_dham_yatra.html'],
  '/tours/nepal-nomads-chitwan-pokhara-kathmandu-caraventure': ['/motorhome_nepal_tour.html', '/nepal.htm', '/nepal1.htm', '/nepal2.htm', '/nepal3.htm', '/indinep.htm', '/indinep1.htm', '/nepalsik.htm', '/sightnep.htm'],
  '/tours/himalayan-escape-to-kumaon': ['/kumaun.htm'],
  '/tours/buddhist-trail-caravan-calmventure': ['/himachal_buddhist_trail.html'],
  '/tours': [
    '/24-nights-25days-tour', '/rajasthan-11-nights-12-days', '/rajasthan-18-nights-19-days', '/adventures-of-himalyas',
    '/best_rajasthan.html', '/entire_rajasthan.html', '/motorhome_rajasthan_tour.html', '/goraj.htm',
    '/himachal.htm', '/himachal1.htm', '/motorhome_himachal_tour.html', '/sighthim.htm', '/sightgoa.htm',
    '/beauty_of_kashmir.html', '/motorhome_tibet_tour.html', '/tajmahal_tour.html', '/India_tour.html', '/journey.html',
    '/customize_tour.html', '/fixed_departure_tour.html', '/motorhome_guided_tour.html', '/motorbike_tour.html',
    '/amazingholidays.asp', '/tour/:slug*',
  ],
  '/': ['/01_home.html', '/index.htm', '/index.html', '/homeview.asp', '/homeonwheels.asp', '/menu.htm', '/menu.html', '/layout.htm'],
}

export const legacyRedirects: Redirect[] = [
  ...Object.entries(legacy).flatMap(([destination, sources]) => sources.map((source) => ({ source, destination, permanent: true }))),
  { source: '/sitemap.php', destination: '/sitemap.xml', permanent: true },
  // Any other old page file → the homepage (not images, scripts or WordPress — those stay 404).
  { source: '/:page([^/]+\\.(?:html?|asp))', destination: '/', permanent: true },
]

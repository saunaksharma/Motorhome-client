import type { Payload } from 'payload'

// Idempotent content seed. Invoke by importing `runSeed(payload)`.
// Minimal Lexical rich-text value from a plain paragraph string.
const rt = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      },
    ],
  },
})

// Seed a collection only if it is empty (never overwrite client data).
async function seedIfEmpty(payload: Payload, collection: any, docs: any[]) {
  const { totalDocs } = await payload.count({ collection })
  if (totalDocs > 0) {
    console.log(`  skip ${collection} — already has ${totalDocs}`)
    return
  }
  for (const data of docs) await payload.create({ collection, data })
  console.log(`  seeded ${collection}: ${docs.length}`)
}

async function mapByName(payload: Payload, collection: any): Promise<Record<string, number>> {
  const res = await payload.find({ collection, limit: 200, depth: 0 })
  return Object.fromEntries(res.docs.map((d: any) => [d.name, d.id]))
}

export const runSeed = async (payload: Payload) => {
  console.log('Seeding…')

  // 1) Filter taxonomies
  await seedIfEmpty(payload, 'caravan-filter-options', [
    { name: 'Core', group: 'class', sortOrder: 1 },
    { name: 'Ignite', group: 'class', sortOrder: 2 },
    { name: 'Pulse', group: 'class', sortOrder: 3 },
    { name: 'Zenith', group: 'class', sortOrder: 4 },
    { name: 'Delhi', group: 'base-location' },
    { name: 'Hyderabad', group: 'base-location' },
    { name: 'Chauffeur Driven', group: 'drive-type' },
    { name: 'Self Driven', group: 'drive-type' },
    { name: '2-4 Berth', group: 'berth-range' },
    { name: '4-8 Berth', group: 'berth-range' },
    { name: '8-12 Berth', group: 'berth-range' },
  ])
  await seedIfEmpty(payload, 'tour-filter-options', [
    { name: '2-4 Days', group: 'duration-band' },
    { name: '4-7 Days', group: 'duration-band' },
    { name: '7-15 Days', group: 'duration-band' },
    { name: '15-30 Days', group: 'duration-band' },
    { name: 'Himachal', group: 'location' },
    { name: 'Rajasthan', group: 'location' },
    { name: 'Uttarakhand', group: 'location' },
    { name: 'Ladakh', group: 'location' },
    { name: 'Riverside Caravanning', group: 'preference' },
    { name: 'Waterfall', group: 'preference' },
    { name: 'Beachside Caravanning', group: 'preference' },
    { name: 'Jungle Quest', group: 'preference' },
    { name: 'Mountain View', group: 'preference' },
    { name: 'City View', group: 'preference' },
  ])

  const cfo = await mapByName(payload, 'caravan-filter-options')
  const tfo = await mapByName(payload, 'tour-filter-options')

  // 2) Hero slides (design pages 1–14)
  await seedIfEmpty(payload, 'hero-slides', [
    { headingLine1: 'CHOOSE YOUR', headingLine2: 'HOME AWAY HOME', ctaLabel: 'BOOK NOW', ctaLink: '/caravans', sortOrder: 1 },
    { headingLine1: 'EXPANDABLE MOTORHOME', headingLine2: 'HARPER', ctaLabel: 'RENT NOW', ctaLink: '/caravans', sortOrder: 2 },
    { headingLine1: 'ADVENTURES OF', headingLine2: 'LADAKH', ctaLabel: 'BOOK NOW', ctaLink: '/tours', sortOrder: 3 },
    { headingLine1: 'WEEKEND GETAWAY', headingLine2: 'TO THE WILD', ctaLabel: 'BOOK NOW', ctaLink: '/tours', sortOrder: 4 },
    { headingLine1: 'VEHICLE FOR', headingLine2: 'ELECTION CAMPAIGNS', ctaLabel: 'BOOK NOW', ctaLink: '/caravans', sortOrder: 5 },
    { headingLine1: 'WILLOW', headingLine2: 'ZENITH CLASS', ctaLabel: 'BOOK NOW', ctaLink: '/caravans', sortOrder: 6 },
    { headingLine1: 'CARAVANS FOR', headingLine2: 'SELF DRIVE', ctaLabel: 'BOOK NOW', ctaLink: '/caravans', sortOrder: 7 },
  ])

  // 3) Featured caravans
  await seedIfEmpty(payload, 'caravans', [
    { name: 'Willow', class: cfo['Zenith'], baseLocation: cfo['Delhi'], berthRange: cfo['4-8 Berth'], driveType: cfo['Chauffeur Driven'], sleeps: '4-6 People', chargesFrom: 'Charges Start From Delhi', shortDescription: 'All-in luxury motorhome — comfort, features, and no compromises.', featured: true, sortOrder: 1 },
    { name: 'Kástro', class: cfo['Pulse'], baseLocation: cfo['Delhi'], berthRange: cfo['8-12 Berth'], driveType: cfo['Chauffeur Driven'], sleeps: '12 People', chargesFrom: 'Charges Start From Delhi', shortDescription: 'Full-on comfort for long trips and bigger families.', featured: true, sortOrder: 2 },
    { name: 'Aurum', class: cfo['Ignite'], baseLocation: cfo['Hyderabad'], berthRange: cfo['4-8 Berth'], driveType: cfo['Self Driven'], sleeps: '5 People', chargesFrom: 'Charges Start From Hyderabad', shortDescription: 'A step above — a little more power and convenience.', featured: true, sortOrder: 3 },
  ])

  // 4) Featured tours
  await seedIfEmpty(payload, 'tours', [
    { name: 'The Adventures of Ladakh', durationLabel: '15 Days', durationBand: tfo['15-30 Days'], location: tfo['Ladakh'], routeLabel: 'Delhi - Ladakh - Delhi', preference: [tfo['Mountain View']], season: 'May - September', shortDescription: 'A 15-day trip exploring prime places of Ladakh, Pangong, Khardungla etc.', featured: true, sortOrder: 1 },
    { name: 'The Spiti Sojourn', durationLabel: '16 Days', durationBand: tfo['15-30 Days'], location: tfo['Himachal'], routeLabel: 'Delhi - Spiti - Delhi', preference: [tfo['Mountain View']], season: 'April - August', shortDescription: 'Delhi to Spiti caravan expedition — Shimla, Kalpa, Kaza & Chandrataal.', featured: true, sortOrder: 2 },
    { name: 'Weekend Getaway to the Wild', durationLabel: '3 Days', durationBand: tfo['2-4 Days'], location: tfo['Uttarakhand'], routeLabel: 'Delhi - Corbett - Delhi', preference: [tfo['Riverside Caravanning'], tfo['Jungle Quest']], season: 'All Year Round', shortDescription: 'A quick riverside + jungle-safari escape from the city.', featured: true, sortOrder: 3 },
  ])

  // 5) Reviews (design page 16)
  await seedIfEmpty(payload, 'reviews', [
    { reviewerName: 'IAS Rahul Yadav', style: 'quote', rating: 5, quote: 'My journey was to my native village around 1350 kms from Delhi. Great experience — the staff was positive, disciplined and cordial. Would look forward to another trip.', sortOrder: 1 },
    { reviewerName: 'Sandeep Chopra', style: 'quote', rating: 5, quote: 'Motorhome Adventures provides quality service. Travelling in one of their motorhomes to Nainital was the most exciting & full of adventures.', sortOrder: 2 },
    { reviewerName: 'Mr. Gill', style: 'quote', rating: 5, quote: 'The attention to detail and craftsmanship are evident in every aspect of their designs. Look no further than Motorhome Adventures.', sortOrder: 3 },
    { reviewerName: 'R.S.', style: 'quote', rating: 5, quote: 'Very comfortable experience. Excellent staff choice. Highly recommend their services.', sortOrder: 4 },
  ])

  // 6) Tips (design pages 29, 32–37)
  await seedIfEmpty(payload, 'tips', [
    { title: 'How to Pack for a Caravan Trip', body: rt('Carry a soft bag instead of a suitcase, pack essentials first, mix & match outfits, and plan before you pack.'), sortOrder: 1 },
    { title: 'How to Eat Healthy When Traveling in a Caravan', body: rt('With a full kitchen + amenities you get real meals on the road. Plan meals lightly, or use our helper + cook service.'), sortOrder: 2 },
    { title: 'Things to Know Before Planning a Caravan Trip', body: rt('Caravan travel is slower than a car — quality over quantity. Do not overload the itinerary.'), sortOrder: 3 },
    { title: 'How to Empty the Black Water Tank', body: rt('Chauffeur-driven? We handle it. Self-drive? Press a button, add half a bucket of water, waste flushes safely.'), sortOrder: 4 },
    { title: 'Where to Get Fresh Water', body: rt('Chauffeur-driven? Staff know the refill spots. Self-drive? Use the pipe + pump; the meter alerts you when low.'), sortOrder: 5 },
  ])

  // 7) Homepage global content (design pages 16, 24–28, 38, 39)
  const homepage = await payload.findGlobal({ slug: 'homepage' })
  if (!homepage?.aboutSections?.length) {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        reviewsIntro: {
          heading: 'Where Every Journey Finds a Story',
          aboutBlurb: rt('With over 30 years of expertise, Motorhome Adventures leads India’s caravan rental industry with unmatched knowledge of both road and vehicle.'),
        },
        aboutSections: [
          { heading: 'How It All Began..', body: rt('Picture Delhi, 1993. A travel-fanatic couple asked a wild question: why stay in hotels when your home can travel with you? That became India’s first caravan & motorhome rental service.'), imageSide: 'left' },
          { heading: 'The People Behind the Wheel', body: rt('Sanjay Saini and Bina Raj Shahi-Saini have clocked 30+ years caravanning across India, Nepal and Bhutan.'), imageSide: 'right' },
          { heading: 'Why Travel With Us?', body: rt('We are not a faceless company — every motorhome is luxury + quality + comfort, inside and out. We create a feeling: home everywhere, stories anywhere.'), imageSide: 'left' },
        ],
        footprint: [
          { value: 'India · Nepal · Bhutan · Tibet', label: 'Beyond Borders' },
          { value: '15+ Years', label: 'Trail Masters', caption: 'Driver & helper experience' },
          { value: '1 Day – 365 Days', label: 'Journey Span', caption: 'We’ve got you covered' },
        ],
        dreamBigCta: { heading: 'Dream Big With Us', ctaLabel: 'KNOW MORE', ctaLink: '/about' },
      },
    })
    console.log('  seeded homepage global')
  } else {
    console.log('  skip homepage — already populated')
  }

  console.log('Seed complete.')
  return { ok: true }
}

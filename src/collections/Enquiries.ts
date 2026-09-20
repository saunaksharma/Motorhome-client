import type { CollectionConfig } from 'payload'

// Booking-form submissions — the old site's "Reserve Your Adventure" modal
// (SPEC page 3) and the client's required "Customer Data" (design page 53).
// Anyone can submit (create); reads/edits stay admin-only by default, so
// customer PII is never public.
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'destination', 'createdAt'],
    group: 'Submissions',
  },
  access: {
    create: () => true,
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'destination', type: 'text', admin: { description: 'The caravan/tour being enquired about.' } },
    { name: 'preferredTravelDates', type: 'text' },
    { name: 'groupSize', type: 'text' },
    { name: 'budgetRange', type: 'text' },
    { name: 'requirements', type: 'textarea' },
  ],
}

import type { CollectionConfig } from 'payload'

import { notifyNewEnquiry, rejectBots } from '../hooks/formProtection'

// Booking-form submissions — the old site's "Reserve Your Adventure" modal
// (SPEC page 3) and the client's required "Customer Data" (design page 53).
// Anyone can submit (create); reads/edits stay admin-only by default, so
// customer PII is never public.
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'phone', 'destination', 'status', 'createdAt'],
    listSearchableFields: ['firstName', 'lastName', 'email', 'phone'],
    group: 'Inbox',
    description: 'Booking requests sent from the website forms. Update the status as you follow up.',
  },
  access: {
    create: () => true,
  },
  hooks: {
    beforeOperation: [rejectBots],
    afterChange: [notifyNewEnquiry],
  },
  fields: [
    // Lead tracking — admin-only (the public form can't set these; it gets the default).
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quote sent', value: 'quoted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed / Lost', value: 'closed' },
      ],
      access: { create: ({ req }) => Boolean(req.user) },
      admin: { position: 'sidebar', description: 'Where this lead stands.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      access: { create: ({ req }) => Boolean(req.user) },
      admin: { position: 'sidebar', description: 'Private notes — never shown on the website.' },
    },

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

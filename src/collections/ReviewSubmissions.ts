import type { CollectionConfig } from 'payload'

// RETIRED: the website's own review form (client: reviews go to their Google Business Profile
// instead — Business Details → Google review link). Hidden and closed to visitors; the table is
// kept so nothing is dropped (it never received a review).
export const ReviewSubmissions: CollectionConfig = {
  slug: 'review-submissions',
  labels: { singular: 'Customer review', plural: 'Customer reviews' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'caravan', 'travelledTo', 'chooseAgain', 'createdAt'],
    listSearchableFields: ['name', 'email', 'caravan'],
    group: 'Inbox',
    hidden: true,
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'caravan', label: 'Caravan rented', type: 'text', required: true },
    { name: 'days', label: 'Number of days', type: 'text' },
    { name: 'travelledTo', label: 'Where they travelled', type: 'text' },
    { name: 'caravanExperience', label: 'Experience with the caravan', type: 'textarea' },
    { name: 'staffExperience', label: 'Experience with the on-board staff', type: 'textarea' },
    {
      name: 'chooseAgain',
      label: 'Would choose us again?',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'Maybe', value: 'maybe' },
        { label: 'No', value: 'no' },
      ],
    },
    { name: 'recommendReason', label: 'One reason to recommend us', type: 'textarea', required: true },
    {
      name: 'notes',
      type: 'textarea',
      access: { create: ({ req }) => Boolean(req.user) },
      admin: { position: 'sidebar', description: 'Private notes — never shown on the website.' },
    },
  ],
}

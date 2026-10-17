import type { CollectionConfig } from 'payload'

import { rejectBots } from '../hooks/formProtection'
import { csvExport, isoDate } from '../lib/csvExport'

// Reviews sent by returning customers from the website (client: Returning Customer Benefits page,
// in her review format). Private: anyone can send one, only the admin can read them. To show one
// on the homepage, copy it into Homepage → Reviews.
export const ReviewSubmissions: CollectionConfig = {
  slug: 'review-submissions',
  labels: { singular: 'Customer review', plural: 'Customer reviews' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'caravan', 'travelledTo', 'chooseAgain', 'createdAt'],
    listSearchableFields: ['name', 'email', 'caravan'],
    group: 'Inbox',
    description: 'Reviews sent from the Returning Customer Benefits page. To show one on the homepage, add it in Homepage → Reviews.',
    components: { beforeListTable: [{ path: '/components/admin/ExportCsvButton#ExportCsvButton', clientProps: { collection: 'review-submissions' } }] },
  },
  access: {
    create: () => true,
  },
  hooks: {
    beforeOperation: [rejectBots],
  },
  endpoints: [
    csvExport('review-submissions', [
      ['EMAIL', (d) => d.email],
      ['FIRSTNAME', (d) => d.name],
      ['CARAVAN', (d) => d.caravan],
      ['DATE', (d) => isoDate(d.createdAt)],
    ]),
  ],
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

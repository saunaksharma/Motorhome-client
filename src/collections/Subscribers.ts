import type { CollectionConfig } from 'payload'

import { rejectBots } from '../hooks/formProtection'
import { csvExport, isoDate } from '../lib/csvExport'

// Newsletter sign-ups — "Join The Caravan CLUB" (SPEC page 48).
// Anyone can subscribe (create); reads stay admin-only by default.
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    group: 'Inbox',
    description: 'People who joined the newsletter (Join The Caravan CLUB).',
    components: { beforeListTable: [{ path: '/components/admin/ExportCsvButton#ExportCsvButton', clientProps: { collection: 'subscribers' } }] },
  },
  endpoints: [csvExport('subscribers', [['EMAIL', (d) => d.email], ['DATE', (d) => isoDate(d.createdAt)]])],
  access: {
    create: () => true,
  },
  hooks: {
    beforeOperation: [rejectBots],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
  ],
}

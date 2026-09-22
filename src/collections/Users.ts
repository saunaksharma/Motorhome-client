import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  // Brute-force protection: lock an account for 10 minutes after 5 failed logins.
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
  versions: false,
}

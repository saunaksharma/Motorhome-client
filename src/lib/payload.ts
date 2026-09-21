import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'

// Shared accessor for the local Payload API used by server components.
export const getPayloadClient = async () => getPayload({ config: await config })

// Cached per request: the several homepage sections that read this global
// share a single query instead of fetching it each.
export const getHomepage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 1 })
})

import { getPayload } from 'payload'

import config from '@/payload.config'

// Shared accessor for the local Payload API used by server components.
export const getPayloadClient = async () => getPayload({ config: await config })

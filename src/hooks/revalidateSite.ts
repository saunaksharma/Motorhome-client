import { revalidatePath } from 'next/cache'
import type { CollectionConfig, GlobalConfig } from 'payload'

// Any content edit refreshes the whole public site, so the client sees changes
// the moment they hit Save. The site is small and header/footer edits touch every
// page anyway, so clearing everything is simpler (and safer) than per-page tracking.
const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Called outside a request (e.g. a script) — there is no page cache to clear.
  }
}

export const withSiteRevalidation = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  hooks: {
    ...collection.hooks,
    afterChange: [...(collection.hooks?.afterChange ?? []), ({ doc }) => (revalidateSite(), doc)],
    afterDelete: [...(collection.hooks?.afterDelete ?? []), ({ doc }) => (revalidateSite(), doc)],
  },
})

export const withGlobalRevalidation = (global: GlobalConfig): GlobalConfig => ({
  ...global,
  hooks: {
    ...global.hooks,
    afterChange: [...(global.hooks?.afterChange ?? []), ({ doc }) => (revalidateSite(), doc)],
  },
})

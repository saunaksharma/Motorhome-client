import type { CollectionSlug, Endpoint, PayloadRequest } from 'payload'

// "Download for Brevo" (client): a CSV of a collection, for admins only, at /api/<collection>/export.
// Headers use the names Brevo's contact import maps by itself (EMAIL, FIRSTNAME, LASTNAME, SMS);
// the other columns can be kept as contact attributes or skipped during the import.
type Column = [header: string, value: (doc: Record<string, unknown>) => unknown]

const cell = (value: unknown) => {
  const text = value == null ? '' : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const csvExport = (collection: CollectionSlug, columns: Column[]): Endpoint => ({
  path: '/export',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    if (!req.user) return Response.json({ error: 'Log in to the admin first.' }, { status: 401 })
    const { docs } = await req.payload.find({ collection, pagination: false, depth: 0, sort: '-createdAt', req, overrideAccess: false })
    const rows = [columns.map(([header]) => header), ...docs.map((doc) => columns.map(([, value]) => value(doc as unknown as Record<string, unknown>)))]
    // The leading BOM makes Excel read the file as UTF-8 (names like "Kástro" stay intact).
    const csv = String.fromCharCode(0xfeff) + rows.map((row) => row.map(cell).join(',')).join('\r\n')
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${collection}-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  },
})

// Brevo's SMS column needs the country code: a 10-digit Indian number (or 0 + 10 digits) gets +91.
export const brevoPhone = (value: unknown) => {
  const digits = String(value ?? '').replace(/\D/g, '').replace(/^0(\d{10})$/, '$1')
  return !digits ? '' : digits.length === 10 ? `+91${digits}` : `+${digits}`
}

export const isoDate = (value: unknown) => (typeof value === 'string' ? value.slice(0, 10) : '')

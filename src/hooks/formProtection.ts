import { APIError, type CollectionAfterChangeHook, type CollectionBeforeOperationHook } from 'payload'

// The public forms include a hidden "website" input that people never see.
// Bots fill every field, so a value there means the submission is spam.
export const HONEYPOT_FIELD = 'website'

export const rejectBots: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation === 'create' && (args as { data?: Record<string, unknown> }).data?.[HONEYPOT_FIELD]) {
    throw new APIError('Submission rejected.', 400)
  }
  return args
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const KIND: Record<string, string> = { tour: 'Tour', caravan: 'Caravan', innovation: 'Innovation (vehicle)' }

// "91-9871063984", as in the client's old enquiry emails; anything else as typed.
const contactNo = (phone: unknown) => {
  const digits = String(phone ?? '').replace(/\D/g, '').replace(/^0(\d{10})$/, '$1')
  if (digits.length === 10) return `91-${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `91-${digits.slice(2)}`
  return String(phone ?? '')
}

// Email the business about every new booking enquiry (address set in Site Settings → Business
// Details), laid out like the client's old enquiry emails (her screenshots, 2026-10-28): plain
// "Label: value" lines starting with the name (so Gmail's preview shows the details), a rule, then
// where it was sent from. The sender name is the customer's — Gmail shows it only when the site sends
// from an address other than the inbox's own (else "me"). A failed email never blocks the enquiry.
export const notifyNewEnquiry: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  try {
    const business = await req.payload.findGlobal({ slug: 'business', depth: 0 })
    const to = business?.enquiryNotifyEmail
    if (!to) return doc

    const name = `${doc.firstName} ${doc.lastName}`.trim()
    const lines: [string, string][] = [
      ['Full Name', escapeHtml(name)],
      ['Email', doc.email ? `<a href="mailto:${escapeHtml(doc.email)}">${escapeHtml(doc.email)}</a>` : ''],
      ['Contact No', escapeHtml(contactNo(doc.phone))],
      ['Budget Range', escapeHtml(doc.budgetRange)],
      ['Enquiry About', escapeHtml(KIND[doc.enquiryType] ?? doc.enquiryType)],
      ['Interested In', escapeHtml(doc.destination)],
    ]
    const p = (label: string, value: string) => `<p style="margin:0 0 14px">${label}: ${value}</p>`
    const sentFrom = doc.sourcePage
      ? `<a href="${escapeHtml(process.env.SERVER_URL || '')}${escapeHtml(doc.sourcePage)}">${escapeHtml((doc.destination || doc.sourcePage).toUpperCase())}</a>`
      : escapeHtml(String(doc.destination || 'Contact page').toUpperCase())
    const html = `<div style="font-family:Arial,sans-serif;font-size:16px;color:#222">
${lines.filter(([, value]) => value).map(([label, value]) => p(label, value)).join('')}
<hr style="border:0;border-top:1px solid #bbb;margin:18px 0">
${p('Sent From Link', sentFrom)}
<hr style="border:0;border-top:1px solid #bbb;margin:18px 0">
</div>`

    await req.payload.sendEmail({
      from: { name, address: process.env.SMTP_FROM || process.env.SMTP_USER || '' },
      to,
      replyTo: doc.email,
      subject: `Let's Get Caravanning with Motorhome Adventures${doc.destination ? ` — ${doc.destination}` : ''} (${name})`,
      html,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Enquiry notification email failed' })
  }
  return doc
}

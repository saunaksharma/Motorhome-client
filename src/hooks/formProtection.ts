import { APIError, type CollectionAfterChangeHook, type CollectionBeforeOperationHook } from 'payload'

import { enquiryColumns, isoDate, toCsv } from '../lib/csvExport'

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

// " about the caravan Willow (sent from /caravans/willow)" — what and where, in the email's one line.
const KIND: Record<string, string> = { tour: 'the tour ', caravan: 'the caravan ', innovation: 'the vehicle ' }
const about = (doc: { enquiryType?: string | null; destination?: string | null; sourcePage?: string | null }) =>
  (doc.destination ? ` about ${KIND[doc.enquiryType ?? ''] ?? ''}<b>${escapeHtml(doc.destination)}</b>` : '') +
  (doc.sourcePage ? ` (sent from ${escapeHtml(doc.sourcePage)})` : '')

// Email the business about every new booking enquiry (address set in Site Settings → Business
// Details). Client: the details come as a CSV file (opens in Excel; same columns as the admin's
// "Download for Brevo"). A failed email never blocks the enquiry.
export const notifyNewEnquiry: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  try {
    const business = await req.payload.findGlobal({ slug: 'business', depth: 0 })
    const to = business?.enquiryNotifyEmail
    if (!to) return doc

    const name = `${doc.firstName} ${doc.lastName}`
    const file = `enquiry-${isoDate(doc.createdAt)}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.csv`

    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `New enquiry: ${name}${doc.destination ? ` — ${doc.destination}` : ''}`,
      html: `<p>New enquiry from <b>${escapeHtml(name)}</b>${about(doc)}. The details are in the attached file (opens in Excel). Reply to this email to answer them.</p>`,
      attachments: [{ filename: file, content: toCsv(enquiryColumns, [doc]), contentType: 'text/csv; charset=utf-8' }],
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Enquiry notification email failed' })
  }
  return doc
}

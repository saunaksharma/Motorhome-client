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

// Email the business about every new booking enquiry (address set in
// Site Settings → Business Details). A failed email never blocks the enquiry.
export const notifyNewEnquiry: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  try {
    const business = await req.payload.findGlobal({ slug: 'business', depth: 0 })
    const to = business?.enquiryNotifyEmail
    if (!to) return doc

    const rows: [string, unknown][] = [
      ['Name', `${doc.firstName} ${doc.lastName}`],
      ['Email', doc.email],
      ['Phone', doc.phone],
      ['Interested in', doc.destination],
      ['Travel dates', doc.preferredTravelDates],
      ['Group size', doc.groupSize],
      ['Budget', doc.budgetRange],
      ['Requirements', doc.requirements],
    ]
    const html = `<h2>New enquiry from the website</h2><table cellpadding="6">${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table>`

    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `New enquiry: ${doc.firstName} ${doc.lastName}${doc.destination ? ` — ${doc.destination}` : ''}`,
      html,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Enquiry notification email failed' })
  }
  return doc
}

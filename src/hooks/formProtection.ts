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

// Email the business about every new booking enquiry (address set in Site Settings → Business
// Details). Client: the details written out in the email (no attachment), like Brevo's form emails;
// the sender name is the customer's (Gmail still shows "me" for mail from your own address).
// A failed email never blocks the enquiry.
export const notifyNewEnquiry: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  try {
    const business = await req.payload.findGlobal({ slug: 'business', depth: 0 })
    const to = business?.enquiryNotifyEmail
    if (!to) return doc

    const name = `${doc.firstName} ${doc.lastName}`.trim()
    const rows: [string, string][] = [
      ['Name', escapeHtml(name)],
      ['Phone', escapeHtml(doc.phone)],
      ['Email', doc.email ? `<a href="mailto:${escapeHtml(doc.email)}">${escapeHtml(doc.email)}</a>` : ''],
      ['Enquiry about', escapeHtml(KIND[doc.enquiryType] ?? doc.enquiryType)],
      ['Interested in', escapeHtml(doc.destination)],
      ['Budget', escapeHtml(doc.budgetRange)],
      ['Sent from page', escapeHtml(doc.sourcePage)],
      ['Date', escapeHtml(new Date(doc.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }))],
    ]
    const cell = 'padding:8px 12px;border-bottom:1px solid #eee'
    const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">
<h2 style="margin:0 0 12px;color:#0d473f">New enquiry from the website</h2>
<table style="border-collapse:collapse">${rows
      .filter(([, value]) => value)
      .map(([label, value]) => `<tr><td style="${cell};color:#666">${label}</td><td style="${cell}"><b>${value}</b></td></tr>`)
      .join('')}</table>
<p style="color:#666">Reply to this email to answer ${escapeHtml(doc.firstName || 'them')} directly.</p>
</div>`

    await req.payload.sendEmail({
      from: { name: `${name} (website enquiry)`, address: process.env.SMTP_FROM || process.env.SMTP_USER || '' },
      to,
      replyTo: doc.email,
      subject: `New enquiry: ${name}${doc.destination ? ` — ${doc.destination}` : ''}`,
      html,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Enquiry notification email failed' })
  }
  return doc
}

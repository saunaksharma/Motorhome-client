import type { GlobalConfig } from 'payload'

// One place for the business's contact details. Used by the footer, the contact
// page and the floating WhatsApp button — edit here, it updates everywhere.
export const BusinessDetails: GlobalConfig = {
  slug: 'business',
  label: 'Business Details',
  admin: {
    group: 'Site Settings',
    description: 'Contact details shown across the website. Change them here and they update everywhere.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'phone', type: 'text', admin: { description: 'Shown in the footer and contact page, e.g. "+91 98710 63984".' } },
    {
      name: 'whatsapp',
      type: 'text',
      admin: {
        description: 'Number with country code, digits only (e.g. 919871063984). Powers the green chat button. Leave empty to hide it.',
      },
    },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea', admin: { description: 'Office / garage address.' } },
    { name: 'mapUrl', label: 'Google Maps link', type: 'text' },
    { name: 'hours', label: 'Opening hours', type: 'text', admin: { description: 'e.g. "Mon–Sat, 10am–7pm".' } },
    {
      name: 'enquiryNotifyEmail',
      label: 'Send new enquiries to',
      type: 'email',
      // Private: the rest of this global is public (footer/contact page), this address isn't.
      access: { read: ({ req }) => Boolean(req.user) },
      admin: { description: 'Every new booking enquiry is emailed here (once email sending is set up).' },
    },
  ],
}

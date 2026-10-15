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
    {
      name: 'callBookingLink',
      label: 'Book Your Call link',
      type: 'text',
      admin: {
        description:
          'After someone sends the booking form (from any "Book Your Call" button), the enquiry is saved and they are taken here to pick a time, e.g. the Brevo "Lets Get Caravanning" page. Leave empty to just show a thank-you message.',
      },
    },
    // Stored as `mapUrl` (was "Google Maps link"); now the HQ-visit booking page (client).
    {
      name: 'mapUrl',
      label: 'Book an HQ visit link',
      type: 'text',
      admin: { description: 'The booking page for visiting the headquarters (e.g. the Brevo "Visit HQ" link). Shown on the contact page.' },
    },
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

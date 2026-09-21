import { redirect } from 'next/navigation'

// "About Us" redirects to the Home page (the About content lives there),
// per the design (page 53).
export default function AboutPage() {
  redirect('/')
}

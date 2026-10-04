import { Racing_Sans_One } from 'next/font/google'

// The client's Canva poster face (SPEC: Racing Sans One) — the slanted titles in Tips and
// Our Story. Imported only by those sections, so other pages don't download it.
export const racing = Racing_Sans_One({ weight: '400', subsets: ['latin'] })

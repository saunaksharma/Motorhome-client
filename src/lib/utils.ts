import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Standard shadcn/ui class merge helper.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// IDs of a Payload relationship value (single or hasMany, populated or not), as
// strings — used to tag cards with the filter options they match.
export function relIds(value: unknown): string[] {
  const list = Array.isArray(value) ? value : value == null ? [] : [value]
  return list.map((v) => String(typeof v === 'object' && v !== null ? (v as { id: unknown }).id : v))
}

// Reads `name` off a populated Payload relationship value (or null).
export function relName(value: unknown): string | null {
  return value && typeof value === 'object' && 'name' in value
    ? String((value as { name: string }).name)
    : null
}

// CSS object-position from a Payload media doc's focal point (set by clicking the photo
// in the admin), so crops — especially tall phone crops — keep the subject in frame.
export function focalPosition(media: { focalX?: number | null; focalY?: number | null } | null | undefined) {
  return `${media?.focalX ?? 50}% ${media?.focalY ?? 50}%`
}

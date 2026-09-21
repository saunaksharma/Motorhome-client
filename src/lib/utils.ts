import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Standard shadcn/ui class merge helper.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Reads `name` off a populated Payload relationship value (or null).
export function relName(value: unknown): string | null {
  return value && typeof value === 'object' && 'name' in value
    ? String((value as { name: string }).name)
    : null
}

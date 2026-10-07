import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** The website's navy (--color-navy) — behind white website icons and logos so they stay visible. */
export const SITE_NAVY_BG = 'bg-[#192863]'

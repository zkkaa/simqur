import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function untuk merge Tailwind classes
 * Menggabungkan clsx dengan tailwind-merge untuk handle conflicting classes
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // Result: 'py-1 px-4' (px-2 di-override)
 * cn('text-red-500', condition && 'text-blue-500') // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
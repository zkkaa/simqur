import { format as formatFns, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { toIndonesiaDate, getDayName, formatIndonesiaTime } from './timezone'

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date with Indonesia timezone
 * @param date - Date object or string
 * @param formatStr - Format string (e.g., 'dd MMM yyyy', 'dd/MM/yyyy')
 */
export function formatDate(date: Date | string, formatStr: string = 'dd MMM yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  return formatFns(indonesiaDate, formatStr, { locale: id })
}

/**
 * Format date with day name (e.g., "Senin, 22 Des 2025")
 */
export function formatDateWithDay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  const dayName = getDayName(indonesiaDate)
  const formatted = formatFns(indonesiaDate, 'dd MMM yyyy', { locale: id })
  return `${dayName}, ${formatted}`
}

/**
 * Format datetime with day name and time (e.g., "Senin, 22 Des 2025 09:30")
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  const dayName = getDayName(indonesiaDate)
  const dateStr = formatFns(indonesiaDate, 'dd MMM yyyy', { locale: id })
  const timeStr = formatIndonesiaTime(indonesiaDate)
  return `${dayName}, ${dateStr} ${timeStr}`
}

/**
 * Format time only (e.g., "09:30" or "09:30:45")
 */
export function formatTime(date: Date | string, includeSeconds: boolean = false): string {
  return formatIndonesiaTime(date, includeSeconds)
}

/**
 * Format relative date (e.g., "2 jam yang lalu", "3 hari yang lalu")
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  
  return formatDistanceToNow(indonesiaDate, {
    addSuffix: true,
    locale: id,
  })
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Format phone number Indonesia
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format: 0812-3456-7890 or 021-1234-5678
  if (cleaned.startsWith('0')) {
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
    } else {
      return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
    }
  }
  
  return phone
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''))
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}
import { format as formatFns, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { toIndonesiaDate, getDayName, formatIndonesiaTime } from './timezone'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`
  } else if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`
  } else {
    return `Rp ${amount}`
  }
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

export function formatDateWithDay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  const dayName = getDayName(indonesiaDate)
  const formatted = formatFns(indonesiaDate, 'dd MMM yyyy', { locale: id })
  return `${dayName}, ${formatted}`
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  const dayName = getDayName(indonesiaDate)
  const dateStr = formatFns(indonesiaDate, 'dd MMM yyyy', { locale: id })
  const timeStr = formatIndonesiaTime(indonesiaDate)
  return `${dayName}, ${dateStr} ${timeStr}`
}

export function formatTime(date: Date | string, includeSeconds: boolean = false): string {
  return formatIndonesiaTime(date, includeSeconds)
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaDate = toIndonesiaDate(dateObj)
  
  return formatDistanceToNow(indonesiaDate, {
    addSuffix: true,
    locale: id,
  })
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('0')) {
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
    } else {
      return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
    }
  }
  
  return phone
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''))
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}
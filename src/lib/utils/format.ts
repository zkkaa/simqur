import { format as dateFnsFormat, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

/**
 * Format angka ke format Rupiah
 * @example formatCurrency(1000000) => "Rp 1.000.000"
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
 * Format angka dengan separator tanpa Rp
 * @example formatNumber(1000000) => "1.000.000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Parse string currency ke number
 * @example parseCurrency("Rp 1.000.000") => 1000000
 */
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, '')) || 0
}

/**
 * Format tanggal ke format Indonesia
 * @example formatDate(new Date(), 'dd MMMM yyyy') => "17 Desember 2025"
 */
export function formatDate(
  date: Date | string,
  formatStr: string = 'dd MMMM yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateFnsFormat(dateObj, formatStr, { locale: id })
}

/**
 * Format tanggal relatif (kemarin, hari ini, besok)
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dateStr = dateFnsFormat(dateObj, 'yyyy-MM-dd')
  const todayStr = dateFnsFormat(today, 'yyyy-MM-dd')
  const yesterdayStr = dateFnsFormat(yesterday, 'yyyy-MM-dd')
  const tomorrowStr = dateFnsFormat(tomorrow, 'yyyy-MM-dd')

  if (dateStr === todayStr) return 'Hari ini'
  if (dateStr === yesterdayStr) return 'Kemarin'
  if (dateStr === tomorrowStr) return 'Besok'

  return formatDate(dateObj, 'dd MMM yyyy')
}

/**
 * Format nama hari dalam bahasa Indonesia
 */
export function formatDayName(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateFnsFormat(dateObj, 'EEEE', { locale: id })
}

/**
 * Singkatan nama (ambil 2 huruf pertama untuk avatar)
 * @example getInitials("Budi Santoso") => "BS"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text dengan ellipsis
 * @example truncate("Lorem ipsum dolor sit amet", 10) => "Lorem ipsu..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitalize first letter
 * @example capitalize("hello world") => "Hello world"
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Format nomor telepon Indonesia
 * @example formatPhone("081234567890") => "0812-3456-7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format (Indonesia)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[2-9][0-9]{7,11}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}
/**
 * Timezone Utility untuk Indonesia (WIB/WITA/WIT)
 * Mengatasi masalah UTC vs Local Time
 */

// Indonesia Timezone: WIB (GMT+7)
const INDONESIA_TIMEZONE = 'Asia/Jakarta'
const INDONESIA_OFFSET = 7 * 60 // 7 hours in minutes

/**
 * Get current date in Indonesia timezone (YYYY-MM-DD format)
 */
export function getIndonesiaDate(): string {
  const now = new Date()
  const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
  
  const year = indonesiaTime.getFullYear()
  const month = String(indonesiaTime.getMonth() + 1).padStart(2, '0')
  const day = String(indonesiaTime.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Get current datetime in Indonesia timezone
 */
export function getIndonesiaDateTime(): Date {
  const now = new Date()
  return new Date(now.toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
}

/**
 * Convert any date to Indonesia timezone
 */
export function toIndonesiaDate(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Date(dateObj.toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
}

/**
 * Format date to YYYY-MM-DD in Indonesia timezone
 */
export function formatDateForDB(date?: Date | string): string {
  const dateObj = date ? (typeof date === 'string' ? new Date(date) : date) : new Date()
  const indonesiaTime = new Date(dateObj.toLocaleString('en-US', { timeZone: INDONESIA_TIMEZONE }))
  
  const year = indonesiaTime.getFullYear()
  const month = String(indonesiaTime.getMonth() + 1).padStart(2, '0')
  const day = String(indonesiaTime.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Get start and end date for a month in Indonesia timezone
 */
export function getMonthRange(month: number, year: number) {
  // Start date: first day of month
  const startDate = new Date(year, month - 1, 1)
  const start = formatDateForDB(startDate)
  
  // End date: last day of month
  const endDate = new Date(year, month, 0)
  const end = formatDateForDB(endDate)
  
  return { start, end }
}

/**
 * Check if a date is today in Indonesia timezone
 */
export function isToday(date: Date | string): boolean {
  const today = getIndonesiaDate()
  const checkDate = formatDateForDB(date)
  return today === checkDate
}

/**
 * Get day name in Indonesian
 */
export function getDayName(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaTime = toIndonesiaDate(dateObj)
  
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[indonesiaTime.getDay()]
}

/**
 * Format time in Indonesia timezone (HH:mm or HH:mm:ss)
 */
export function formatIndonesiaTime(date: Date | string, includeSeconds = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaTime = toIndonesiaDate(dateObj)
  
  const hours = String(indonesiaTime.getHours()).padStart(2, '0')
  const minutes = String(indonesiaTime.getMinutes()).padStart(2, '0')
  
  if (includeSeconds) {
    const seconds = String(indonesiaTime.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }
  
  return `${hours}:${minutes}`
}

/**
 * Format full datetime with day name (e.g., "Senin, 22 Des 2025 09:30")
 */
export function formatIndonesiaDateTime(date: Date | string, includeTime = true): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const indonesiaTime = toIndonesiaDate(dateObj)
  
  const dayName = getDayName(indonesiaTime)
  const day = indonesiaTime.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  const month = months[indonesiaTime.getMonth()]
  const year = indonesiaTime.getFullYear()
  
  const dateStr = `${dayName}, ${day} ${month} ${year}`
  
  if (includeTime) {
    const time = formatIndonesiaTime(indonesiaTime)
    return `${dateStr} ${time}`
  }
  
  return dateStr
}
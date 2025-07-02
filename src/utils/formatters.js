// Currency formatting for Indian Rupees
export const formatCurrency = (amount, options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }

  return new Intl.NumberFormat('en-IN', defaultOptions).format(amount)
}

// Number formatting with Indian number system
export const formatNumber = (number, options = {}) => {
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }

  return new Intl.NumberFormat('en-IN', defaultOptions).format(number)
}

// Percentage formatting
export const formatPercentage = (value, options = {}) => {
  const defaultOptions = {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options
  }

  return new Intl.NumberFormat('en-IN', defaultOptions).format(value / 100)
}

// Date formatting utilities
export const formatDate = (date, format = 'short') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const formats = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYear: { year: 'numeric', month: 'short' },
    dayMonth: { month: 'short', day: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-IN', formats[format] || formats.short).format(dateObj)
}

// Compact number formatting (1.2K, 1.5M, etc.)
export const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(number)
}

// Duration formatting
export const formatDuration = (days) => {
  if (days < 0) return `${Math.abs(days)} days overdue`
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 30) return `${days} days`
  if (days < 365) return `${Math.floor(days / 30)} months`
  return `${Math.floor(days / 365)} years`
}
const MANILA = 'Asia/Manila'

export function todayManila(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MANILA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '—'
  const parts = isoDate.split('-').map(Number)
  const year = parts[0]
  const month = parts[1]
  const day = parts[2]
  if (!year || !month || !day) return isoDate
  const utc = new Date(Date.UTC(year, month - 1, day, 4, 0, 0))
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: MANILA,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(utc)
}

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return '—'
  if (!end || end === start) return formatDate(start)
  if (!start) return formatDate(end)
  return `${formatDate(start)} – ${formatDate(end)}`
}

export function formatTime(hhmm: string): string {
  if (!hhmm) return '—'
  const [hRaw, mRaw] = hhmm.split(':')
  const h = Number(hRaw)
  const m = Number(mRaw)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return hhmm
  if (h === 12 && m === 0) return '12:00 NN'
  if (h === 0 && m === 0) return '12:00 MN'
  const h12 = h % 12 || 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatPhp(amount: number): string {
  if (!Number.isFinite(amount)) return '₱—'
  const formatted = amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `₱${formatted}`
}

export function slugFilename(parts: string[]): string {
  const slug = parts
    .filter(Boolean)
    .join('-')
    .replace(/[^\w]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return slug || 'Klaro-Conforme'
}

export function jobTypeLabel(type: string, other = ''): string {
  switch (type) {
    case 'shoot':
      return 'Shoot'
    case 'engagement':
      return 'Engagement'
    case 'workshop':
      return 'Workshop / Training'
    case 'other':
      return other.trim() || 'Other'
    default:
      return type || '—'
  }
}

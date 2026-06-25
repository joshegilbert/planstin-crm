const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function today(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function todayISO(): string {
  const d = today()
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

export function parseISO(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

export function daysUntil(iso: string | null | undefined): number | null {
  const d = parseISO(iso)
  if (!d) return null
  return Math.round((d.getTime() - today().getTime()) / 86400000)
}

export function fmt(iso: string | null | undefined): string {
  const d = parseISO(iso)
  if (!d) return '—'
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
}

export function addInterval(
  iso: string | null | undefined,
  cadence: string,
  days?: number | null,
): string | null {
  const base = parseISO(iso) || today()
  const d = new Date(base)
  if (cadence === 'monthly') {
    d.setMonth(d.getMonth() + 1)
  } else if (cadence === 'quarterly') {
    d.setMonth(d.getMonth() + 3)
  } else if (cadence === 'custom' && days) {
    d.setDate(d.getDate() + Number(days))
  } else {
    return null
  }
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

export function guessDate(str: string | null | undefined): string | null {
  if (!str) return null
  const m = str.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/)
  if (!m) return null
  const mo = Number(m[1])
  const da = Number(m[2])
  let yr = m[3] ? Number(m[3]) : null
  if (yr && yr < 100) yr += 2000
  const t = today()
  if (!yr) {
    yr = t.getFullYear()
    if (new Date(yr, mo - 1, da) < t) yr += 1
  }
  return yr + '-' + String(mo).padStart(2, '0') + '-' + String(da).padStart(2, '0')
}

export function monAbbr(iso: string | null | undefined): string {
  const d = parseISO(iso)
  if (!d) return ''
  return MONTHS[d.getMonth()]
}

export function isoMinus(iso: string | null | undefined, days: number): string | null {
  const d = parseISO(iso)
  if (!d) return null
  d.setDate(d.getDate() - days)
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

export function isoPlus(iso: string | null | undefined, days: number): string | null {
  const d = parseISO(iso)
  if (!d) return null
  d.setDate(d.getDate() + days)
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

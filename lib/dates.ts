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

function buildISO(yr: number, mo: number, da: number): string {
  return yr + '-' + String(mo).padStart(2, '0') + '-' + String(da).padStart(2, '0')
}

// Parses a freeform handoff-window string like "6/24-7/1" or "8/8 – 8/14" into real
// ISO start/end dates. These are one-time onboarding windows for the current year, not
// recurring annual dates, so the year is never rolled forward based on "is it already past" —
// an overdue window should stay anchored to this year, not get silently pushed to next year.
export function parseTransitionWindow(str: string | null | undefined): { start: string | null; end: string | null } {
  if (!str || !str.trim()) return { start: null, end: null }

  const parts = str.split(/\s*[-–—]\s*/).map((p) => p.trim()).filter(Boolean)
  if (parts.length === 0 || parts.length > 2) return { start: null, end: null }

  const rawStart = parts[0]
  const rawEnd = parts.length === 2 ? parts[1] : parts[0]

  const tokenRe = /^(\d{1,2})\/(\d{1,2})$/
  const ms = rawStart.match(tokenRe)
  const me = rawEnd.match(tokenRe)
  if (!ms || !me) return { start: null, end: null }

  const yr = today().getFullYear()
  const start = buildISO(yr, Number(ms[1]), Number(ms[2]))
  let end = buildISO(yr, Number(me[1]), Number(me[2]))

  if (end < start) end = buildISO(yr + 1, Number(me[1]), Number(me[2]))

  return { start, end }
}

// Implements the observed handoff rule: full ownership / commission effective always land
// on the 1st of the month following the window's start month.
export function firstOfNextMonth(iso: string): string {
  const d = parseISO(iso)
  if (!d) return iso
  let yr = d.getFullYear()
  let mo = d.getMonth() + 2 // getMonth() is 0-indexed; +1 for next month, +1 to convert to 1-indexed
  if (mo > 12) {
    mo -= 12
    yr += 1
  }
  return buildISO(yr, mo, 1)
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

// Monday-aligned week start — distinct from CalendarView's Sunday-aligned getWeekDays (which
// mirrors the Sun-Sat month-grid columns; a different, unrelated need). Agenda's week dividers
// use the conventional Mon-Sun business week instead.
export function mondayOfWeek(iso: string): string {
  const d = parseISO(iso)
  if (!d) return iso
  const dow = d.getDay() // 0 = Sun, 1 = Mon, ...
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return buildISO(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

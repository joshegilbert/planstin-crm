import type { Group } from '@/types'
import { guessDate, monAbbr } from './dates'

type IntakePatch = Partial<Group>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function parseIntake(raw: string, _g: Group): IntakePatch {
  const lines = raw.split(/\r?\n/)
  const patch: IntakePatch = {}

  const grab = (re: RegExp): string | null => {
    for (const ln of lines) {
      const m = ln.match(re)
      if (m) return (m[1] || '').trim()
    }
    return null
  }

  let v: string | null

  if ((v = grab(/transition timeline\s*[:\-–]\s*(.+)/i))) patch.transitionTimeline = v
  if ((v = grab(/^\s*(?:gc|group contact)\s*[:\-]\s*(.+)/i))) patch.contactName = v
  if ((v = grab(/salesforce\s*link\s*[:\-]\s*(\S+)/i))) patch.salesforceLink = v
  if ((v = grab(/(?:benefits?\s*(?:enrollment)?\s*)?platform\s*[:\-]\s*(.+)/i)))
    patch.platform = v as Group['platform']
  if ((v = grab(/group size\s*[:\-]\s*(.+)/i))) {
    const a = v.match(/\((\d+)\)\s*active/i)
    if (a) patch.activeOnPlans = Number(a[1])
    const e = v.match(/\(?\s*\d+\s*-\s*(\d+)\s*\)?/)
    if (e) patch.employees = Number(e[1])
  }
  if ((v = grab(/renewal\s*(?:effective)?\s*date\s*[:\-]\s*(.+)/i))) {
    const iso = guessDate(v)
    if (iso) {
      patch.renewalDate = iso
      patch.renewalMonth = monAbbr(iso)
    }
  }

  for (const ln of lines) {
    const m = ln.match(/nho\s*[:\-]\s*(.+)/i)
    if (m) {
      patch.nhoNote = m[1].trim()
      patch.nhoStatus = /not (set|required)|does not require/i.test(m[1]) ? 'not-required' : 'tbd'
      break
    }
  }

  for (const ln of lines) {
    let m: RegExpMatchArray | null
    if ((m = ln.match(/intro email.*?[:\-]\s*(.+)/i))) {
      const d = guessDate(m[1])
      if (d) patch.introEmailDate = d
    }
    if ((m = ln.match(/warm hand-?off.*?[:\-]\s*(.+)/i))) {
      const d = guessDate(m[1])
      if (d) patch.warmHandoffDate = d
    }
  }

  for (const ln of lines) {
    const m = ln.match(/(?:oe vs|auto-?renewal|open enrollment)[^:]*[:\-]\s*(.+)/i)
    if (m) {
      patch.oeDecisionNote = m[1].trim()
      if (/auto-?renew/i.test(ln)) patch.oeMode = 'passive'
      break
    }
  }

  for (const ln of lines) {
    const m = ln.match(/important notes?\s*[:\-]\s*(.+)/i)
    if (m) {
      patch.watchOuts = m[1].trim()
      if (/monitor/i.test(m[1])) patch.monitorMonthly = true
      break
    }
  }

  return patch
}

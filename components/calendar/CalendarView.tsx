'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGroups } from '@/hooks/useGroups'
import { useReminders } from '@/hooks/useReminders'
import { daysUntil, todayISO, isoMinus, fmt } from '@/lib/dates'
import type { Group, Reminder } from '@/types'
import AgendaView from './AgendaView'

export type CalEventType =
  | 'renewal'
  | 'follow-up'
  | 'check-in'
  | 'handoff'
  | 'reminder'
  | 'commission'
  | 'ownership'

export interface CalEvent {
  id: string
  groupId?: string
  date: string
  type: CalEventType
  label: string
  detail?: string
}

export const EVENT_META: Record<CalEventType, { color: string; bg: string; textColor: string; label: string; order: number }> = {
  'renewal':    { color: '#dc2626', bg: '#fef2f2', textColor: '#991b1b', label: 'Renewal',     order: 0 },
  'follow-up':  { color: '#ca8a04', bg: '#fefce8', textColor: '#78350f', label: 'Follow-up',   order: 3 },
  'check-in':   { color: '#2563eb', bg: '#eff6ff', textColor: '#1e40af', label: 'Check-in',    order: 4 },
  'handoff':    { color: '#0891b2', bg: '#ecfeff', textColor: '#164e63', label: 'Handoff',     order: 5 },
  'reminder':   { color: '#7c3aed', bg: '#f5f3ff', textColor: '#4c1d95', label: 'Reminder',   order: 6 },
  'commission': { color: '#64748b', bg: '#f8fafc', textColor: '#334155', label: 'Commission',  order: 7 },
  'ownership':  { color: '#6366f1', bg: '#eef2ff', textColor: '#3730a3', label: 'Ownership',   order: 8 },
}

const LEGEND_ITEMS = Object.entries(EVENT_META) as Array<[CalEventType, typeof EVENT_META[CalEventType]]>

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toISO(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function getCalDays(year: number, month: number): Array<{ date: string; currentMonth: boolean }> {
  const firstDay = new Date(year, month, 1)
  const startDow = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const result: Array<{ date: string; currentMonth: boolean }> = []

  for (let i = startDow - 1; i >= 0; i--) {
    result.push({ date: toISO(new Date(year, month, -i)), currentMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({ date: toISO(new Date(year, month, d)), currentMonth: true })
  }
  const remaining = 42 - result.length
  for (let d = 1; d <= remaining; d++) {
    result.push({ date: toISO(new Date(year, month + 1, d)), currentMonth: false })
  }
  return result
}

function buildEventMap(groups: Group[], reminders: Reminder[]): Map<string, CalEvent[]> {
  const map = new Map<string, CalEvent[]>()

  function add(ev: CalEvent) {
    if (!ev.date) return
    if (!map.has(ev.date)) map.set(ev.date, [])
    map.get(ev.date)!.push(ev)
  }

  for (const g of groups) {
    if (g.renewalDate)
      add({ id: `ren-${g.id}`, groupId: g.id, date: g.renewalDate, type: 'renewal', label: g.groupName })
    if (g.followUpDate)
      add({ id: `fu-${g.id}`, groupId: g.id, date: g.followUpDate, type: 'follow-up', label: g.groupName, detail: g.followUpNote || undefined })
    if (g.nextCheckIn)
      add({ id: `ci-${g.id}`, groupId: g.id, date: g.nextCheckIn, type: 'check-in', label: g.groupName })

    if (g.status === 'transition') {
      if (g.warmHandoffDate)
        add({ id: `ho-${g.id}`, groupId: g.id, date: g.warmHandoffDate, type: 'handoff', label: g.groupName })
      if (g.commissionEffective)
        add({ id: `com-${g.id}`, groupId: g.id, date: g.commissionEffective, type: 'commission', label: g.groupName })
      if (g.fullOwnership)
        add({ id: `own-${g.id}`, groupId: g.id, date: g.fullOwnership, type: 'ownership', label: g.groupName })
    }
  }

  for (const r of reminders) {
    if (!r.completed) {
      add({
        id: `rem-${r.id}`,
        groupId: r.groupId ?? undefined,
        date: r.triggerDate,
        type: 'reminder',
        label: r.note || (r.groupId ? 'Group reminder' : 'Personal reminder'),
      })
    }
  }

  for (const [, evs] of map) {
    evs.sort((a, b) => EVENT_META[a.type].order - EVENT_META[b.type].order)
  }

  return map
}

// Maps each date in the current month view to the count of groups whose window (as returned
// by getWindow) spans that date. Generic so it can serve OE windows, transition handoff
// windows, or any other start/end-date pair on a Group.
function buildRangeMap(
  groups: Group[],
  calDays: Array<{ date: string; currentMonth: boolean }>,
  getWindow: (g: Group) => { start: string | null; end: string | null },
): Map<string, number> {
  const map = new Map<string, number>()
  for (const g of groups) {
    const { start, end } = getWindow(g)
    if (!start || !end) continue
    for (const { date } of calDays) {
      if (date >= start && date <= end) {
        map.set(date, (map.get(date) ?? 0) + 1)
      }
    }
  }
  return map
}

// Groups whose window (as returned by getWindow) spans the given day. Replaces ad-hoc,
// non-date-scoped filters (e.g. "every group with status='transition'") with a single
// reusable check against the actual start/end dates.
function groupsInWindow(
  groups: Group[],
  day: string,
  getWindow: (g: Group) => { start: string | null; end: string | null },
): Group[] {
  return groups.filter((g) => {
    const { start, end } = getWindow(g)
    if (!start || !end) return false
    return day >= start && day <= end
  })
}

export function isOverdueTransition(g: Group): boolean {
  return g.status === 'transition' && !g.changeCompleted && !!g.handoffWindowEnd && g.handoffWindowEnd < todayISO()
}

// Shared shape for "a date range plus the groups in it" — used for both transition handoff
// windows and OE windows, since both get the same merge-by-exact-dates + banner treatment.
export interface WindowGroup {
  start: string
  end: string
  groups: Group[]
}

// Many groups onboard in the same batch and share the exact same handoff window — a banner
// per group would mean a dozen identical-looking stacked bars. Merge groups that share a
// window into one banner instead, so the grid stays readable regardless of batch size.
function buildTransitionWindows(groups: Group[]): WindowGroup[] {
  const map = new Map<string, Group[]>()
  for (const g of groups) {
    if (g.status !== 'transition' || !g.handoffWindowStart || !g.handoffWindowEnd) continue
    const key = `${g.handoffWindowStart}_${g.handoffWindowEnd}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(g)
  }
  return Array.from(map.entries()).map(([key, gs]) => {
    const [start, end] = key.split('_')
    return { start, end, groups: gs }
  })
}

// Same merge-by-exact-window idea as transitions, for open enrollment.
function buildOEWindows(groups: Group[]): WindowGroup[] {
  const map = new Map<string, Group[]>()
  for (const g of groups) {
    if (!g.oeStartDate || !g.oeEndDate) continue
    const key = `${g.oeStartDate}_${g.oeEndDate}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(g)
  }
  return Array.from(map.entries()).map(([key, gs]) => {
    const [start, end] = key.split('_')
    return { start, end, groups: gs }
  })
}

export type BannerKind = 'transition' | 'oe'

export interface WeekBanner {
  key: string
  label: string
  kind: BannerKind
  color: string
  start: string
  end: string
  groups: Group[]
  startCol: number
  spanCols: number
  isStart: boolean
  isEnd: boolean
  lane: number
}

const LANE_HEIGHT = 20
const DATE_ROW_HEIGHT = 28

function transitionLabel(w: WindowGroup): string {
  return w.groups.length === 1 ? w.groups[0].groupName : `${w.groups.length} groups — Handoff window`
}
function transitionColor(w: WindowGroup): string {
  return w.groups.some(isOverdueTransition) ? '#dc2626' : '#0e7490'
}
function oeLabel(w: WindowGroup): string {
  return w.groups.length === 1 ? w.groups[0].groupName : `${w.groups.length} groups — Open enrollment`
}
function oeColor(): string {
  return '#ea580c'
}

// Lays out the windows that overlap a given week into non-overlapping horizontal lanes
// (the same idea Google Calendar uses to stack multi-day events within a week row).
// Generic over "kind" so it can serve transition handoff windows and OE windows alike —
// callers stack the two kinds' lanes on top of each other (see laneOffset).
function buildWeekBanners(
  windows: WindowGroup[],
  weekDays: Array<{ date: string }>,
  kind: BannerKind,
  getLabel: (w: WindowGroup) => string,
  getColor: (w: WindowGroup) => string,
  laneOffset = 0,
): WeekBanner[] {
  const weekStart = weekDays[0].date
  const weekEnd = weekDays[weekDays.length - 1].date

  const segments = windows
    .filter((w) => w.end >= weekStart && w.start <= weekEnd)
    .map((w) => {
      const clippedStart = w.start < weekStart ? weekStart : w.start
      const clippedEnd = w.end > weekEnd ? weekEnd : w.end
      const startCol = weekDays.findIndex((d) => d.date === clippedStart)
      const endCol = weekDays.findIndex((d) => d.date === clippedEnd)
      return {
        key: `${kind}_${w.start}_${w.end}`,
        label: getLabel(w),
        kind,
        color: getColor(w),
        start: w.start,
        end: w.end,
        groups: w.groups,
        startCol,
        spanCols: endCol - startCol + 1,
        isStart: clippedStart === w.start,
        isEnd: clippedEnd === w.end,
      }
    })
    .sort((a, b) => a.startCol - b.startCol)

  const laneEnds: number[] = []
  return segments.map((seg) => {
    let lane = laneEnds.findIndex((end) => end < seg.startCol)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(seg.startCol + seg.spanCols - 1)
    } else {
      laneEnds[lane] = seg.startCol + seg.spanCols - 1
    }
    return { ...seg, lane: lane + laneOffset }
  })
}

export function getTransitionStep(g: Group): string {
  if (g.changeCompleted) return 'Complete'
  if (!g.warmHandoff) return 'Awaiting handoff'
  if (!g.newContact) return 'Make welcome call'
  if (!g.ownershipTaken) return 'Take ownership'
  if (!g.sfUpdated) return 'Update Salesforce'
  return 'Mark complete'
}

function fmtDayLabel(iso: string): string {
  const [y, m, d] = iso.split('-')
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
  return DOW_LABELS[date.getDay()] + ', ' + MONTH_SHORT[parseInt(m) - 1] + ' ' + parseInt(d)
}

function getWeekDays(anchorISO: string): string[] {
  const [y, m, d] = anchorISO.split('-').map(Number)
  const anchor = new Date(y, m - 1, d)
  const dow = anchor.getDay()
  const sunday = new Date(anchor)
  sunday.setDate(anchor.getDate() - dow)
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const dt = new Date(sunday)
    dt.setDate(sunday.getDate() + i)
    days.push(toISO(dt))
  }
  return days
}

interface ActiveRowProps {
  color: string
  label: string
  groups: Group[]
  expanded: boolean
  onToggle: () => void
  renderChip: (g: Group) => React.ReactNode
}

function ActiveRow({ color, label, groups, expanded, onToggle, renderChip }: ActiveRowProps) {
  const visible = expanded ? groups : groups.slice(0, 4)
  return (
    <div className="flex items-start gap-3 mb-2.5">
      <div className="flex items-center gap-1.5 w-32 flex-shrink-0 pt-0.5">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-xs font-semibold text-ink-faint">{label}</span>
        <span className="text-xs text-ink-faint">({groups.length})</span>
      </div>
      <div className="flex flex-wrap gap-2 flex-1">
        {visible.map(renderChip)}
        {groups.length > 4 && (
          <button
            onClick={onToggle}
            className="text-xs px-3 py-1.5 rounded-full text-ink-faint hover:text-ink transition-colors"
            style={{ background: 'var(--surface-2)' }}
          >
            {expanded ? 'Show less' : `+${groups.length - 4} more`}
          </button>
        )}
      </div>
    </div>
  )
}

export default function CalendarView() {
  const router = useRouter()
  const { data: groups = [], isLoading } = useGroups()
  const { data: reminders = [] } = useReminders()
  const todayStr = todayISO()
  const todayDate = new Date(todayStr + 'T00:00:00')

  const [year, setYear] = useState(todayDate.getFullYear())
  const [month, setMonth] = useState(todayDate.getMonth())
  const [selectedDay, setSelectedDay] = useState<string>(todayStr)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const toggleRow = (key: string) => setExpandedRows((s) => ({ ...s, [key]: !s[key] }))
  const [openBanner, setOpenBanner] = useState<{ banner: WeekBanner; top: number; left: number; maxHeight: number } | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month')

  function handleBannerClick(e: React.MouseEvent<HTMLButtonElement>, banner: WeekBanner) {
    const rect = e.currentTarget.getBoundingClientRect()
    const POPOVER_WIDTH = 288
    const VIEWPORT_MARGIN = 16
    const maxHeight = Math.min(400, window.innerHeight - VIEWPORT_MARGIN * 2)
    setOpenBanner({
      banner,
      // Clamp so the popover always fits fully within the viewport — it's `position: fixed`,
      // so anything past the viewport edge can't be reached by scrolling the page.
      top: Math.max(VIEWPORT_MARGIN, Math.min(rect.bottom + 6, window.innerHeight - maxHeight - VIEWPORT_MARGIN)),
      left: Math.max(VIEWPORT_MARGIN, Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN)),
      maxHeight,
    })
  }

  const eventMap = useMemo(() => buildEventMap(groups, reminders), [groups, reminders])
  const calDays = useMemo(() => getCalDays(year, month), [year, month])
  const selectedEvents = useMemo(() => eventMap.get(selectedDay) ?? [], [eventMap, selectedDay])
  const thisWeekDays = useMemo(() => getWeekDays(todayStr), [todayStr])
  const oeRangeMap = useMemo(
    () => buildRangeMap(groups, calDays, (g) => ({ start: g.oeStartDate, end: g.oeEndDate })),
    [groups, calDays],
  )
  const transitionWindows = useMemo(() => buildTransitionWindows(groups), [groups])
  const oeWindows = useMemo(() => buildOEWindows(groups), [groups])
  const weeks = useMemo(() => {
    const out: Array<Array<{ date: string; currentMonth: boolean }>> = []
    for (let i = 0; i < calDays.length; i += 7) out.push(calDays.slice(i, i + 7))
    return out
  }, [calDays])

  // Active processes — groups currently in the middle of OE, transition, or renewal window
  const activeProcesses = useMemo(() => {
    const oeActive = groups.filter((g) => {
      if (!g.oeStartDate) return false
      if (!g.oeEndDate) return todayStr >= g.oeStartDate
      return todayStr >= g.oeStartDate && todayStr <= g.oeEndDate
    })
    const inTransition = groups.filter((g) => g.status === 'transition' && !g.changeCompleted)
    const renewalWindow = groups
      .filter((g) => {
        const d = daysUntil(g.renewalDate)
        return d != null && d >= 0 && d <= 90
      })
      .sort((a, b) => (daysUntil(a.renewalDate) ?? 999) - (daysUntil(b.renewalDate) ?? 999))
    return { oeActive, inTransition, renewalWindow }
  }, [groups, todayStr])

  // Groups whose window includes the selected day, scoped per category — replaces the old
  // blanket "every transition-status group, on every day" list with real date scoping.
  const selectedDayOE = useMemo(
    () => groupsInWindow(groups, selectedDay, (g) => ({ start: g.oeStartDate, end: g.oeEndDate })),
    [groups, selectedDay],
  )

  const selectedDayTransition = useMemo(
    () =>
      groupsInWindow(groups, selectedDay, (g) =>
        g.status === 'transition'
          ? { start: g.handoffWindowStart, end: g.handoffWindowEnd }
          : { start: null, end: null },
      ),
    [groups, selectedDay],
  )

  // The 90-day reach-out window: starts 90 days before renewal, ends on renewal day.
  const selectedDayRenewal = useMemo(
    () =>
      groupsInWindow(groups, selectedDay, (g) =>
        g.renewalDate ? { start: isoMinus(g.renewalDate, 90), end: g.renewalDate } : { start: null, end: null },
      ),
    [groups, selectedDay],
  )

  const hasActiveProcesses =
    activeProcesses.oeActive.length > 0 ||
    activeProcesses.inTransition.length > 0 ||
    activeProcesses.renewalWindow.length > 0

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }
  function goToday() {
    setYear(todayDate.getFullYear())
    setMonth(todayDate.getMonth())
    setSelectedDay(todayStr)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-faint text-sm">
        Loading calendar…
      </div>
    )
  }

  return (
    <div className="px-6 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold text-ink">
          {MONTH_NAMES[month]} {year}
        </h1>
        <div className="flex-1" />
        <div className="flex items-center border border-line rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('month')}
            className={[
              'px-3 py-1.5 text-sm transition-colors border-r border-line',
              viewMode === 'month' ? 'bg-canvas-subtle text-ink font-medium' : 'text-ink-faint hover:bg-canvas-subtle hover:text-ink',
            ].join(' ')}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={[
              'px-3 py-1.5 text-sm transition-colors',
              viewMode === 'agenda' ? 'bg-canvas-subtle text-ink font-medium' : 'text-ink-faint hover:bg-canvas-subtle hover:text-ink',
            ].join(' ')}
          >
            Agenda
          </button>
        </div>
        <button
          onClick={goToday}
          className="text-sm px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink hover:bg-canvas-subtle transition-colors"
        >
          Today
        </button>
        {viewMode === 'month' && (
          <div className="flex items-center border border-line rounded-lg overflow-hidden">
            <button
              onClick={prevMonth}
              className="px-3 py-1.5 text-sm text-ink-faint hover:bg-canvas-subtle hover:text-ink transition-colors border-r border-line"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              className="px-3 py-1.5 text-sm text-ink-faint hover:bg-canvas-subtle hover:text-ink transition-colors"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-5">
        {LEGEND_ITEMS.map(([type, meta]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-ink-faint">
            <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
            {meta.label}
          </div>
        ))}
      </div>

      {/* Active Processes Panel */}
      {hasActiveProcesses && (
        <div className="bg-canvas rounded-2xl border border-line shadow-sm p-4 mb-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3">
            Active Right Now
          </div>

          {/* OE Active */}
          {activeProcesses.oeActive.length > 0 && (
            <ActiveRow
              color="#ea580c"
              label="OE Open"
              groups={activeProcesses.oeActive}
              expanded={!!expandedRows.oe}
              onToggle={() => toggleRow('oe')}
              renderChip={(g) => {
                const d = daysUntil(g.oeEndDate)
                const sub = d != null ? (d === 0 ? 'closes today' : d < 0 ? 'OE ended' : `closes in ${d}d`) : 'no end date'
                return (
                  <button
                    key={g.id}
                    onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-colors hover:opacity-80"
                    style={{ background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}
                  >
                    {g.groupName}
                    <span className="opacity-70">— {sub}</span>
                  </button>
                )
              }}
            />
          )}

          {/* In Transition — shrunk to a summary line. The grid itself now shows handoff
              windows as banners day-by-day, so a full chip wall here would just duplicate
              that. Overdue count still surfaced so it's never silently hidden. */}
          {activeProcesses.inTransition.length > 0 && (
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex items-center gap-1.5 w-32 flex-shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ background: '#0891b2' }} />
                <span className="text-xs font-semibold text-ink-faint">Transition</span>
              </div>
              <div className="flex-1 flex items-center gap-2 text-xs text-ink-faint">
                <span>
                  {activeProcesses.inTransition.length} group{activeProcesses.inTransition.length !== 1 ? 's' : ''} in a handoff window
                  {(() => {
                    const overdueCount = activeProcesses.inTransition.filter(isOverdueTransition).length
                    return overdueCount > 0 ? (
                      <span className="font-medium" style={{ color: 'oklch(0.47 0.16 30)' }}>
                        {' '}· {overdueCount} overdue
                      </span>
                    ) : null
                  })()}
                </span>
                <button
                  onClick={() => router.push('/groups?filter=transition')}
                  className="font-medium hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  View all →
                </button>
              </div>
            </div>
          )}

          {/* Renewal Window */}
          {activeProcesses.renewalWindow.length > 0 && (
            <ActiveRow
              color="#dc2626"
              label="Renewal ≤90d"
              groups={activeProcesses.renewalWindow}
              expanded={!!expandedRows.renewal}
              onToggle={() => toggleRow('renewal')}
              renderChip={(g) => {
                const d = daysUntil(g.renewalDate)
                const sub = d != null ? (d === 0 ? 'renews today' : `in ${d}d`) : ''
                return (
                  <button
                    key={g.id}
                    onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-colors hover:opacity-80"
                    style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
                  >
                    {g.groupName}
                    {sub && <span className="opacity-70">— {sub}</span>}
                  </button>
                )
              }}
            />
          )}
        </div>
      )}

      {/* This Week strip */}
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">
          This Week
        </div>
        <div className="grid grid-cols-7 gap-2">
          {thisWeekDays.map((dayISO) => {
            const events = eventMap.get(dayISO) ?? []
            const isToday = dayISO === todayStr
            const isSelected = dayISO === selectedDay
            const isPast = dayISO < todayStr
            const [, , dd] = dayISO.split('-')
            const dayLabel = DOW_LABELS[new Date(dayISO + 'T00:00:00').getDay()]
            const oeCount = oeRangeMap.get(dayISO) ?? 0

            return (
              <button
                key={dayISO}
                onClick={() => {
                  setSelectedDay(dayISO)
                  const d = new Date(dayISO + 'T00:00:00')
                  setYear(d.getFullYear())
                  setMonth(d.getMonth())
                }}
                className={[
                  'rounded-xl p-2 text-center transition-colors border',
                  isSelected ? 'border-accent bg-canvas-subtle' : 'border-line hover:bg-canvas-subtle',
                ].join(' ')}
              >
                <div className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isToday ? 'text-accent' : 'text-ink-faint'}`}>
                  {isToday ? 'Today' : dayLabel}
                </div>
                <div
                  className={[
                    'text-sm font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full',
                    isToday ? 'text-white' : (isPast ? 'text-ink-faint' : 'text-ink'),
                  ].join(' ')}
                  style={isToday ? { background: 'var(--accent)' } : {}}
                >
                  {parseInt(dd, 10)}
                </div>
                <div className="mt-1.5 flex justify-center gap-px flex-wrap">
                  {events.length === 0 && oeCount === 0 ? (
                    <span className="text-[9px] text-ink-faint">—</span>
                  ) : (
                    <>
                      {oeCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ea580c' }} title="OE active" />
                      )}
                      {events.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: EVENT_META[ev.type].color }}
                          title={EVENT_META[ev.type].label}
                        />
                      ))}
                      {events.length > 3 && (
                        <span className="text-[9px] text-ink-faint">+{events.length - 3}</span>
                      )}
                    </>
                  )}
                </div>
                {(events.length > 0 || oeCount > 0) && (
                  <div className="text-[10px] text-ink-faint mt-0.5">
                    {events.length + (oeCount > 0 ? 0 : 0)} event{events.length !== 1 ? 's' : ''}
                    {oeCount > 0 && events.length === 0 ? `${oeCount} in OE` : ''}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Agenda view — rolling chronological list, alternative to the month grid */}
      {viewMode === 'agenda' && (
        <AgendaView eventMap={eventMap} transitionWindows={transitionWindows} oeWindows={oeWindows} anchorDay={selectedDay} />
      )}

      {/* Two-column: calendar + day detail */}
      {viewMode === 'month' && (
      <div className="flex gap-5 items-start">
        {/* Calendar grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-7 mb-px">
            {DOW_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold uppercase tracking-wider text-ink-faint py-2"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-px bg-line border border-line rounded-xl overflow-hidden">
            {weeks.map((week, weekIdx) => {
              const transitionBanners = buildWeekBanners(transitionWindows, week, 'transition', transitionLabel, transitionColor)
              const transitionLaneCount = transitionBanners.length ? Math.max(...transitionBanners.map((b) => b.lane)) + 1 : 0
              const oeBanners = buildWeekBanners(oeWindows, week, 'oe', oeLabel, oeColor, transitionLaneCount)
              const banners = [...transitionBanners, ...oeBanners]
              const laneCount = banners.length ? Math.max(...banners.map((b) => b.lane)) + 1 : 0

              return (
                <div key={weekIdx} className="relative grid grid-cols-7 gap-px bg-line">
                  {week.map(({ date, currentMonth }) => {
                    const events = eventMap.get(date) ?? []
                    const isToday = date === todayStr
                    const isSelected = date === selectedDay
                    const dayNum = parseInt(date.split('-')[2], 10)

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDay(date)}
                        className={[
                          'bg-canvas min-h-[92px] p-1.5 text-left flex flex-col transition-colors relative',
                          !currentMonth ? 'opacity-30' : '',
                          isSelected && !isToday ? 'ring-2 ring-inset ring-accent' : '',
                          currentMonth && !isSelected ? 'hover:bg-canvas-subtle' : '',
                          isSelected ? 'bg-canvas-subtle' : '',
                        ].join(' ')}
                      >
                        {/* Date number */}
                        <div
                          className={[
                            'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 flex-shrink-0',
                            isToday ? 'text-white' : currentMonth ? 'text-ink' : 'text-ink-faint',
                          ].join(' ')}
                          style={isToday ? { background: 'var(--accent)' } : {}}
                        >
                          {dayNum}
                        </div>

                        {/* Event chips — pushed down to leave room for handoff-window banners */}
                        <div
                          className="flex-1 space-y-0.5 min-h-0 overflow-hidden"
                          style={{ marginTop: laneCount * LANE_HEIGHT }}
                        >
                          {events.slice(0, 3).map((ev) => {
                            const meta = EVENT_META[ev.type]
                            return (
                              <div
                                key={ev.id}
                                className="flex items-center gap-1 rounded px-1 py-px overflow-hidden"
                                style={{ background: meta.bg }}
                                title={`${meta.label}: ${ev.label}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                                <span className="text-[9px] leading-tight truncate font-medium" style={{ color: meta.textColor }}>
                                  {ev.label}
                                </span>
                              </div>
                            )
                          })}
                          {events.length > 3 && (
                            <div className="text-[9px] text-ink-faint px-1 font-medium">
                              +{events.length - 3} more
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}

                  {/* Handoff-window and OE-window banners — continuous bars spanning the days
                      they cover, like a multi-day Google Calendar event. Wrapper has
                      pointer-events-none so empty space still lets clicks reach the day cells
                      beneath; each bar re-enables pointer-events for itself. */}
                  {banners.length > 0 && (
                    <div
                      className="absolute left-0 right-0 pointer-events-none"
                      style={{ top: DATE_ROW_HEIGHT }}
                    >
                      {banners.map((b) => (
                        <button
                          key={b.key}
                          onClick={(e) => handleBannerClick(e, b)}
                          className="absolute flex items-center px-1.5 text-[9px] font-medium text-white truncate pointer-events-auto hover:opacity-90 transition-opacity"
                          style={{
                            top: b.lane * LANE_HEIGHT,
                            left: `${(b.startCol / 7) * 100}%`,
                            width: `calc(${(b.spanCols / 7) * 100}% - 2px)`,
                            height: LANE_HEIGHT - 2,
                            background: b.color,
                            borderTopLeftRadius: b.isStart ? 4 : 0,
                            borderBottomLeftRadius: b.isStart ? 4 : 0,
                            borderTopRightRadius: b.isEnd ? 4 : 0,
                            borderBottomRightRadius: b.isEnd ? 4 : 0,
                          }}
                          title={b.label}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Day detail panel (sticky) */}
        <div className="w-72 flex-shrink-0 bg-canvas border border-line rounded-2xl shadow-sm overflow-hidden sticky top-4">
          {/* Day header */}
          <div className="px-4 pt-4 pb-3 border-b border-line">
            <div className="font-semibold text-sm text-ink">{fmtDayLabel(selectedDay)}</div>
            {selectedDay === todayStr && (
              <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--accent)' }}>
                Today
              </div>
            )}
            <div className="text-xs text-ink-faint mt-0.5">
              {selectedEvents.length === 0 && selectedDayOE.length === 0
                ? 'Nothing scheduled'
                : `${selectedEvents.length} event${selectedEvents.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Event list + active processes */}
          <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
            {/* Scheduled events */}
            {selectedEvents.length === 0 &&
            selectedDayOE.length === 0 &&
            selectedDayTransition.length === 0 &&
            selectedDayRenewal.length === 0 ? (
              <p className="text-sm text-ink-faint italic text-center py-6">
                Nothing scheduled for this day.
              </p>
            ) : (
              <>
                {selectedEvents.map((ev) => {
                  const meta = EVENT_META[ev.type]
                  return (
                    <div
                      key={ev.id}
                      className="rounded-xl p-3 border border-line"
                      style={{ borderLeftWidth: 3, borderLeftColor: meta.color, background: meta.bg }}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: meta.color }}>
                        {meta.label}
                      </div>
                      {ev.groupId ? (
                        <button
                          onClick={() => router.push(`/groups/${ev.groupId}?from=calendar`)}
                          className="text-sm font-semibold text-left w-full truncate block hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          {ev.label}
                        </button>
                      ) : (
                        <div className="text-sm font-semibold text-ink truncate">{ev.label}</div>
                      )}
                      {ev.detail && (
                        <div className="text-xs text-ink-faint mt-1 leading-relaxed">{ev.detail}</div>
                      )}
                    </div>
                  )
                })}

                {/* Active on this day: OE windows */}
                {selectedDayOE.length > 0 && (
                  <div>
                    {(selectedEvents.length > 0) && (
                      <div className="border-t border-line my-3" />
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#ea580c' }}>
                      In Open Enrollment
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDayOE.map((g) => {
                        const d = daysUntil(g.oeEndDate)
                        const sub = d != null ? (d === 0 ? 'closes today' : d > 0 ? `${d}d left` : 'ended') : ''
                        return (
                          <button
                            key={g.id}
                            onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                            className="text-[10px] px-2 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
                            style={{ background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}
                          >
                            {g.groupName}{sub ? ` · ${sub}` : ''}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* In handoff window on this day */}
                {selectedDayTransition.length > 0 && (
                  <div>
                    {(selectedEvents.length > 0 || selectedDayOE.length > 0) && (
                      <div className="border-t border-line my-3" />
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#0891b2' }}>
                      In Transition
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDayTransition.map((g) => {
                        const overdue = isOverdueTransition(g)
                        return (
                          <button
                            key={g.id}
                            onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                            className="text-[10px] px-2 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
                            style={
                              overdue
                                ? { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
                                : { background: '#ecfeff', color: '#164e63', border: '1px solid #a5f3fc' }
                            }
                          >
                            {g.groupName} · {overdue ? 'Overdue' : getTransitionStep(g)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* In the 90-day renewal reach-out window on this day */}
                {selectedDayRenewal.length > 0 && (
                  <div>
                    {(selectedEvents.length > 0 || selectedDayOE.length > 0 || selectedDayTransition.length > 0) && (
                      <div className="border-t border-line my-3" />
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#dc2626' }}>
                      Renewal reach-out window
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDayRenewal.map((g) => {
                        const d = daysUntil(g.renewalDate)
                        const sub = d != null ? (d === 0 ? 'renews today' : `in ${d}d`) : ''
                        return (
                          <button
                            key={g.id}
                            onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                            className="text-[10px] px-2 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
                            style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
                          >
                            {g.groupName}{sub ? ` · ${sub}` : ''}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Handoff-window banner popover — Google Calendar style: click a banner, see the
          groups in that window right there, no need to look at the day panel. */}
      {openBanner && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenBanner(null)} />
          <div
            className="fixed z-50 w-72 bg-canvas border border-line rounded-2xl shadow-lg overflow-hidden flex flex-col"
            style={{ top: openBanner.top, left: openBanner.left, maxHeight: openBanner.maxHeight }}
          >
            <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2 border-b border-line flex-shrink-0">
              <div>
                <div className="text-sm font-semibold text-ink">
                  {fmt(openBanner.banner.start)} – {fmt(openBanner.banner.end)}
                </div>
                <div className="text-xs text-ink-faint mt-0.5">
                  {openBanner.banner.groups.length} group{openBanner.banner.groups.length !== 1 ? 's' : ''} in {openBanner.banner.kind === 'oe' ? 'open enrollment' : 'handoff window'}
                </div>
              </div>
              <button
                onClick={() => setOpenBanner(null)}
                className="text-ink-faint hover:text-ink text-sm leading-none px-1"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-2 overflow-y-auto flex-1 space-y-1">
              {openBanner.banner.groups.map((g) => {
                if (openBanner.banner.kind === 'oe') {
                  const d = daysUntil(g.oeEndDate)
                  const sub = d != null ? (d === 0 ? 'closes today' : d < 0 ? 'OE ended' : `closes in ${d}d`) : ''
                  return (
                    <button
                      key={g.id}
                      onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                      className="w-full flex items-center justify-between gap-2 text-left text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ background: '#fff7ed', color: '#9a3412' }}
                    >
                      <span className="font-medium truncate">{g.groupName}</span>
                      <span className="flex-shrink-0 opacity-70">{sub}</span>
                    </button>
                  )
                }
                const overdue = isOverdueTransition(g)
                return (
                  <button
                    key={g.id}
                    onClick={() => router.push(`/groups/${g.id}?from=calendar`)}
                    className="w-full flex items-center justify-between gap-2 text-left text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                    style={
                      overdue
                        ? { background: '#fef2f2', color: '#991b1b' }
                        : { background: '#ecfeff', color: '#164e63' }
                    }
                  >
                    <span className="font-medium truncate">{g.groupName}</span>
                    <span className="flex-shrink-0 opacity-70">{overdue ? 'Overdue' : getTransitionStep(g)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

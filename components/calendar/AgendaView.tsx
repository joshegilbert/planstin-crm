'use client'
import { useState, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import type { Group, Reminder } from '@/types'
import { fmt, isoPlus, daysUntil, mondayOfWeek } from '@/lib/dates'
import { useUpdateReminder } from '@/hooks/useReminders'
import { ReminderForm } from '@/components/reminders/ReminderForm'
import {
  EVENT_META,
  MERGEABLE_TYPES,
  isOverdueTransition,
  getTransitionStep,
  type CalEvent,
  type CalEventType,
  type WindowGroup,
  type BannerKind,
} from './CalendarView'

interface AgendaViewProps {
  eventMap: Map<string, CalEvent[]>
  transitionWindows: WindowGroup[]
  oeWindows: WindowGroup[]
  anchorDay: string
  reminders: Reminder[]
}

const ROLL_DAYS = 30
const DENSE_THRESHOLD = 6
const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmtAgendaDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return DOW_LABELS[date.getDay()] + ', ' + MONTH_SHORT[m - 1] + ' ' + d
}

type AgendaItemType = CalEventType | 'window'

interface AgendaItem {
  id: string
  type: AgendaItemType
  label: string
  detail?: string
  groupId?: string
  window?: WindowGroup
  windowKind?: BannerKind
  reminderId?: string
}

const WINDOW_META: Record<BannerKind, { color: string; label: string }> = {
  transition: { color: '#0e7490', label: 'Handoff window' },
  oe: { color: '#ea580c', label: 'Open enrollment' },
}

function metaFor(item: Pick<AgendaItem, 'type' | 'windowKind'>) {
  return item.type === 'window' ? WINDOW_META[item.windowKind!] : EVENT_META[item.type]
}

interface MergedAgendaItem {
  key: string
  label: string
  groupId?: string
  items: AgendaItem[] // window items are always length 1 — windows represent many groups, not one
}

// Same-company same-day derived events (commission/ownership/etc.) collapse into one row with
// multiple type badges instead of appearing once per type-grouped section below. Mirrors
// CalendarView's mergeCalEvents — items here are already scoped to a single day, so the merge
// key only needs groupId.
function mergeAgendaItems(items: AgendaItem[]): MergedAgendaItem[] {
  const merged: MergedAgendaItem[] = []
  const indexByKey = new Map<string, number>()

  for (const item of items) {
    const isMergeable = item.type !== 'window' && MERGEABLE_TYPES.has(item.type) && !!item.groupId
    const key = isMergeable ? `group-${item.groupId}` : item.id

    if (isMergeable && indexByKey.has(key)) {
      merged[indexByKey.get(key)!].items.push(item)
      continue
    }

    indexByKey.set(key, merged.length)
    merged.push({ key, label: item.label, groupId: item.groupId, items: [item] })
  }

  return merged
}

// Rolling N days from anchorDay, each with its point events plus one entry per window
// (transition or OE) that *starts* that day — windows aren't repeated across every day they
// span, that would defeat the point of a list view. Days with nothing are skipped, like
// Google Calendar's Schedule view.
//
// A window already in progress when the agenda is opened (started before anchorDay) would
// never match an exact start-day lookup and would silently vanish — it's surfaced on the
// first visible day instead, same as Google Calendar shows ongoing multi-day events on
// "today" rather than only on their original start date.
function buildAgendaDays(
  eventMap: Map<string, CalEvent[]>,
  transitionWindows: WindowGroup[],
  oeWindows: WindowGroup[],
  anchorDay: string,
  numDays: number,
): Array<{ date: string; items: AgendaItem[]; weekStart: string }> {
  const allWindows: Array<{ window: WindowGroup; kind: BannerKind }> = [
    ...transitionWindows.map((w) => ({ window: w, kind: 'transition' as const })),
    ...oeWindows.map((w) => ({ window: w, kind: 'oe' as const })),
  ]
  const windowsByStart = new Map<string, Array<{ window: WindowGroup; kind: BannerKind }>>()
  for (const entry of allWindows) {
    if (entry.window.start <= anchorDay) continue // handled separately, below, on the first day
    if (!windowsByStart.has(entry.window.start)) windowsByStart.set(entry.window.start, [])
    windowsByStart.get(entry.window.start)!.push(entry)
  }
  const ongoingAsOfAnchor = allWindows.filter((e) => e.window.start <= anchorDay && e.window.end >= anchorDay)

  const days: Array<{ date: string; items: AgendaItem[]; weekStart: string }> = []
  for (let i = 0; i < numDays; i++) {
    const date = isoPlus(anchorDay, i)
    if (!date) continue

    const items: AgendaItem[] = (eventMap.get(date) ?? []).map((ev) => ({
      id: ev.id,
      type: ev.type,
      label: ev.label,
      detail: ev.detail,
      groupId: ev.groupId,
      reminderId: ev.reminderId,
    }))

    const windowEntries = i === 0 ? ongoingAsOfAnchor : windowsByStart.get(date) ?? []
    for (const { window: w, kind } of windowEntries) {
      items.push({
        id: `win-${kind}-${w.start}-${w.end}`,
        type: 'window',
        windowKind: kind,
        label: w.groups.length === 1 ? w.groups[0].groupName : `${w.groups.length} groups — ${WINDOW_META[kind].label}`,
        detail: i === 0 && w.start < anchorDay ? `Since ${fmt(w.start)}, through ${fmt(w.end)}` : `Through ${fmt(w.end)}`,
        window: w,
      })
    }

    if (items.length > 0) days.push({ date, items, weekStart: mondayOfWeek(date) })
  }
  return days
}

export default function AgendaView({ eventMap, transitionWindows, oeWindows, anchorDay, reminders }: AgendaViewProps) {
  const router = useRouter()
  const updateReminder = useUpdateReminder()
  const [numDays, setNumDays] = useState(ROLL_DAYS)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [editingReminderKey, setEditingReminderKey] = useState<string | null>(null)

  const days = buildAgendaDays(eventMap, transitionWindows, oeWindows, anchorDay, numDays)

  function toggle(key: string) {
    setExpanded((s) => ({ ...s, [key]: !s[key] }))
  }

  function goToGroup(id: string) {
    router.push(`/groups/${id}?from=calendar`)
  }

  function renderMergedItem(m: MergedAgendaItem) {
    const item = m.items[0]
    const isWindow = item.type === 'window'
    const isReminder = item.type === 'reminder'
    const windowKey = `win-${item.id}`
    const windowExpanded = !!expanded[windowKey]
    const detail = m.items.find((i) => i.detail)?.detail

    if (isReminder && editingReminderKey === m.key) {
      const reminder = reminders.find((r) => r.id === item.reminderId)
      if (reminder) {
        return (
          <div key={m.key} className="px-3 py-1">
            <ReminderForm
              mode="edit"
              initialDate={reminder.triggerDate}
              initialNote={reminder.note}
              groupLocked
              saving={updateReminder.isPending}
              onSave={(patch) =>
                updateReminder.mutate(
                  { id: reminder.id, patch: { triggerDate: patch.triggerDate, note: patch.note } },
                  { onSuccess: () => setEditingReminderKey(null) },
                )
              }
              onCancel={() => setEditingReminderKey(null)}
            />
          </div>
        )
      }
    }

    return (
      <div key={m.key} className="rounded-lg overflow-hidden group">
        <button
          onClick={() => (isWindow ? toggle(windowKey) : m.groupId && goToGroup(m.groupId))}
          className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-canvas-subtle transition-colors"
        >
          {m.items.length === 1 ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: metaFor(item).color }} />
              <span className="text-xs font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: metaFor(item).color }}>
                {metaFor(item).label}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 flex-shrink-0">
              {m.items.map((i) => (
                <span
                  key={i.type}
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: metaFor(i).color }}
                >
                  ● {metaFor(i).label}
                </span>
              ))}
            </span>
          )}
          <span className="text-sm text-ink truncate">{m.label}</span>
          {detail && <span className="text-xs text-ink-faint truncate">{detail}</span>}
          {isReminder && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); setEditingReminderKey(m.key) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setEditingReminderKey(m.key) } }}
              className="ml-auto text-xs text-ink-faint hover:text-ink transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
            >
              Edit
            </span>
          )}
          {isWindow && (
            <span className="ml-auto text-xs text-ink-faint flex-shrink-0">{windowExpanded ? '▾' : '▸'}</span>
          )}
        </button>
        {isWindow && windowExpanded && item.window && (
          <div className="pl-7 pb-2 flex flex-wrap gap-1.5">
            {item.window.groups.map((g: Group) => {
              if (item.windowKind === 'oe') {
                const d = daysUntil(g.oeEndDate)
                const sub = d != null ? (d === 0 ? 'closes today' : d < 0 ? 'OE ended' : `closes in ${d}d`) : ''
                return (
                  <button
                    key={g.id}
                    onClick={() => goToGroup(g.id)}
                    className="text-[10px] px-2 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
                    style={{ background: '#fff7ed', color: '#9a3412' }}
                  >
                    {g.groupName} · {sub}
                  </button>
                )
              }
              const overdue = isOverdueTransition(g)
              return (
                <button
                  key={g.id}
                  onClick={() => goToGroup(g.id)}
                  className="text-[10px] px-2 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
                  style={
                    overdue
                      ? { background: '#fef2f2', color: '#991b1b' }
                      : { background: '#ecfeff', color: '#164e63' }
                  }
                >
                  {g.groupName} · {overdue ? 'Overdue' : getTransitionStep(g)}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-canvas border border-line rounded-2xl shadow-sm overflow-hidden">
      {days.length === 0 ? (
        <p className="text-sm text-ink-faint italic text-center py-10">
          Nothing scheduled in the next {numDays} days.
        </p>
      ) : (
        <div className="divide-y divide-line">
          {(() => {
            let lastWeekStart: string | null = null
            return days.map(({ date, items, weekStart }) => {
              const merged = mergeAgendaItems(items)
              const dense = merged.length > DENSE_THRESHOLD
              const groupedByType = dense
                ? merged.reduce<Record<string, MergedAgendaItem[]>>((acc, m) => {
                    const type = m.items[0].type
                    ;(acc[type] ??= []).push(m)
                    return acc
                  }, {})
                : null

              const showWeekDivider = weekStart !== lastWeekStart
              lastWeekStart = weekStart

              return (
                <Fragment key={date}>
                  {showWeekDivider && (
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-ink-faint bg-canvas-subtle">
                      Week of {fmt(weekStart)} – {fmt(isoPlus(weekStart, 6))}
                    </div>
                  )}
                  <div className="px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint mb-2">
                      {fmtAgendaDay(date)}
                    </div>
                    <div className="space-y-1">
                      {groupedByType
                        ? Object.entries(groupedByType).map(([type, typeItems]) => {
                            const groupKey = `${date}-${type}`
                            const typeExpanded = !!expanded[groupKey]
                            const visible = typeExpanded ? typeItems : typeItems.slice(0, 4)
                            return (
                              <div key={type}>
                                {visible.map(renderMergedItem)}
                                {typeItems.length > 4 && (
                                  <button
                                    onClick={() => toggle(groupKey)}
                                    className="text-xs text-ink-faint hover:text-ink px-3 py-1 transition-colors"
                                  >
                                    {typeExpanded ? 'Show less' : `Show ${typeItems.length - 4} more ${metaFor(typeItems[0].items[0]).label}`}
                                  </button>
                                )}
                              </div>
                            )
                          })
                        : merged.map(renderMergedItem)}
                    </div>
                  </div>
                </Fragment>
              )
            })
          })()}
        </div>
      )}
      <div className="px-4 py-3 border-t border-line text-center">
        <button
          onClick={() => setNumDays((n) => n + ROLL_DAYS)}
          className="text-sm text-ink-faint hover:text-ink transition-colors"
        >
          Load next {ROLL_DAYS} days
        </button>
      </div>
    </div>
  )
}

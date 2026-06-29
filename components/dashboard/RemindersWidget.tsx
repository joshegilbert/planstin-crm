'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useReminders, useAddReminder, useUpdateReminder } from '@/hooks/useReminders'
import { useGroups } from '@/hooks/useGroups'
import { buildVM } from '@/lib/scoring'
import { fmt, daysUntil } from '@/lib/dates'

export default function RemindersWidget() {
  const { data: rawReminders = [] } = useReminders()
  const { data: rawGroups = [] } = useGroups()
  const addReminder = useAddReminder()
  const updateReminder = useUpdateReminder()
  const router = useRouter()

  const [showAdd, setShowAdd] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newNote, setNewNote] = useState('')

  const groupNames = useMemo(
    () => Object.fromEntries(rawGroups.map((g) => [g.id, g.groupName])),
    [rawGroups],
  )

  // Reminders coming up in the next 1-7 days (exclude today/overdue — TodayPanel owns those)
  const activeReminders = useMemo(
    () =>
      rawReminders.filter((r) => {
        const d = daysUntil(r.triggerDate)
        return !r.completed && d != null && d > 0 && d <= 7
      }),
    [rawReminders],
  )

  // Group IDs already represented by a Phase 2 reminder
  const coveredGroupIds = useMemo(
    () => new Set(rawReminders.filter((r) => r.groupId).map((r) => r.groupId!)),
    [rawReminders],
  )

  // Follow-up groups due in the next 1-7 days (not today/overdue — those are in TodayPanel)
  const followUpGroups = useMemo(
    () =>
      rawGroups
        .map(buildVM)
        .filter((g) => {
          if (coveredGroupIds.has(g.id) || !g.followUpDate) return false
          const d = daysUntil(g.followUpDate)
          return d != null && d > 0 && d <= 7
        }),
    [rawGroups, coveredGroupIds],
  )

  type ReminderItem = { kind: 'reminder'; date: string; id: string; r: typeof rawReminders[0] }
  type FollowUpItem = { kind: 'followup'; date: string; id: string; g: ReturnType<typeof buildVM> }
  type Item = ReminderItem | FollowUpItem

  const items: Item[] = useMemo(
    () =>
      [
        ...activeReminders.map((r): ReminderItem => ({ kind: 'reminder', date: r.triggerDate, id: r.id, r })),
        ...followUpGroups.map((g): FollowUpItem => ({ kind: 'followup', date: g.followUpDate || '', id: g.id, g })),
      ].sort((a, b) => a.date.localeCompare(b.date)),
    [activeReminders, followUpGroups],
  )

  const shown = items.slice(0, 8)

  function handleAdd() {
    if (!newDate) return
    addReminder.mutate(
      { groupId: null, triggerDate: newDate, note: newNote },
      { onSuccess: () => { setNewDate(''); setNewNote(''); setShowAdd(false) } },
    )
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-ink">Coming Up</h3>
          {items.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-faint font-medium">
              {items.length}
            </span>
          )}
        </div>
        <button onClick={() => setShowAdd((v) => !v)} className="text-xs text-accent hover:underline">
          + Add
        </button>
      </div>

      {showAdd && (
        <div className="mb-3 space-y-2 p-3 rounded-xl border border-line bg-canvas-subtle">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newDate || addReminder.isPending}
              className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-xs text-ink-faint italic">Nothing coming up in the next 7 days.</p>
      ) : (
        <div className="space-y-1">
          {shown.map((item) => {
            if (item.kind === 'reminder') {
              const { r } = item
              const d = daysUntil(r.triggerDate)
              const overdue = d != null && d < 0
              const isToday = d === 0
              const color = overdue
                ? 'oklch(0.47 0.16 30)'
                : isToday
                ? 'oklch(0.46 0.11 65)'
                : 'var(--text-muted)'
              const label = r.groupId
                ? (groupNames[r.groupId] ?? 'Group reminder')
                : (r.note || 'Reminder')
              const sub = r.groupId && r.note ? r.note : null
              return (
                <div
                  key={r.id}
                  className="flex items-start justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-canvas-subtle transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    {r.groupId ? (
                      <button
                        onClick={() => router.push(`/groups/${r.groupId}`)}
                        className="text-xs font-medium text-accent hover:underline block truncate text-left"
                      >
                        {label}
                      </button>
                    ) : (
                      <p className="text-xs font-medium text-ink truncate">{label}</p>
                    )}
                    {sub && <p className="text-[11px] text-ink-faint truncate">{sub}</p>}
                    <p className="text-[10px]" style={{ color }}>
                      {fmt(r.triggerDate)}
                      {overdue && ` · ${Math.abs(d!)}d overdue`}
                      {isToday && ' · today'}
                    </p>
                  </div>
                  <button
                    onClick={() => updateReminder.mutate({ id: r.id, patch: { completed: true } })}
                    className="text-[10px] text-ink-faint hover:text-ink transition-colors flex-shrink-0 mt-0.5"
                    title="Mark complete"
                  >
                    Done
                  </button>
                </div>
              )
            }

            // follow-up item
            const { g } = item
            return (
              <div
                key={g.id}
                onClick={() => router.push(`/groups/${g.id}`)}
                className="flex items-start justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-canvas-subtle transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-accent truncate">{g.groupName}</p>
                  {g.followUpNote && (
                    <p className="text-[11px] text-ink-faint truncate">{g.followUpNote}</p>
                  )}
                  <p className="text-[10px]" style={{ color: 'oklch(0.47 0.16 30)' }}>
                    {g.followUpText}
                  </p>
                </div>
                <span className="text-[10px] text-ink-faint mt-0.5 flex-shrink-0">follow-up</span>
              </div>
            )
          })}
        </div>
      )}

      {items.length > shown.length && (
        <p className="text-xs text-ink-faint mt-2">+{items.length - shown.length} more</p>
      )}
    </div>
  )
}

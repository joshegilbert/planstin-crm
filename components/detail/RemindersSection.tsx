'use client'
import { useState } from 'react'
import type { Group } from '@/types'
import { fmt, daysUntil, todayISO } from '@/lib/dates'
import { useReminders, useAddReminder, useDeleteReminder, useUpdateReminder } from '@/hooks/useReminders'

interface RemindersSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

export function RemindersSection({ group, onUpdate }: RemindersSectionProps) {
  const { data: reminders = [] } = useReminders(group.id)
  const addReminder = useAddReminder()
  const deleteReminder = useDeleteReminder()
  const updateReminder = useUpdateReminder()

  const [newDate, setNewDate] = useState('')
  const [newNote, setNewNote] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function getEarliestActiveDate(exclude?: string): string | null {
    return (
      reminders
        .filter((r) => !r.completed && r.id !== exclude)
        .map((r) => r.triggerDate)
        .sort()
        .find(Boolean) ?? null
    )
  }

  function handleAdd() {
    if (!newDate) return
    addReminder.mutate(
      { groupId: group.id, triggerDate: newDate, note: newNote },
      {
        onSuccess: () => {
          const earliest = [...reminders.map((r) => r.triggerDate), newDate].sort()[0]
          onUpdate({ followUpDate: earliest, followUpNote: newNote || group.followUpNote })
          setNewDate('')
          setNewNote('')
          setShowForm(false)
        },
      },
    )
  }

  function handleDelete(id: string) {
    deleteReminder.mutate(id, {
      onSuccess: () => {
        const earliest = getEarliestActiveDate(id)
        onUpdate({ followUpDate: earliest, followUpNote: earliest ? group.followUpNote : '' })
        setConfirmDeleteId(null)
      },
    })
  }

  function handleComplete(id: string, currentValue: boolean) {
    updateReminder.mutate(
      { id, patch: { completed: !currentValue } },
      {
        onSuccess: () => {
          const earliest = getEarliestActiveDate(currentValue ? undefined : id)
          onUpdate({ followUpDate: earliest })
        },
      },
    )
  }

  return (
    <div id="reminders-section" className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-ink text-sm">Reminders</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs text-accent hover:underline"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Existing reminders */}
      {reminders.length > 0 && (
        <div className="space-y-2 mb-3">
          {reminders.map((r) => {
            const du = daysUntil(r.triggerDate)
            const overdue = du != null && du < 0
            const dueToday = du === 0
            const dueSoon = du != null && du > 0 && du <= 3

            const dateColor = overdue
              ? 'oklch(0.47 0.16 30)'
              : dueToday
              ? 'oklch(0.46 0.11 65)'
              : 'var(--text-muted)'

            return (
              <div
                key={r.id}
                className="flex items-start gap-3 p-2.5 rounded-xl border border-line bg-canvas-subtle"
              >
                <button
                  onClick={() => handleComplete(r.id, r.completed)}
                  title={r.completed ? 'Mark incomplete' : 'Mark complete'}
                  className="mt-0.5 w-4 h-4 rounded border border-line flex-shrink-0 flex items-center justify-center transition-colors"
                  style={
                    r.completed
                      ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
                      : {}
                  }
                >
                  {r.completed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium" style={{ color: dateColor }}>
                    {fmt(r.triggerDate)}
                    {overdue && ` · overdue ${Math.abs(du!)}d`}
                    {dueToday && ' · today'}
                    {dueSoon && ` · in ${du}d`}
                  </span>
                  {r.note && (
                    <p className="text-xs text-ink mt-0.5 truncate">{r.note}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {confirmDeleteId === r.id ? (
                    <>
                      <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:underline">Yes</button>
                      <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-ink-faint hover:text-ink">No</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(r.id)}
                      className="text-xs text-ink-faint hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {reminders.length === 0 && !showForm && (
        <div className="text-center py-4">
          <p className="text-sm text-ink-faint mb-2">No reminders set</p>
          <button
            onClick={() => { setShowForm(true); setNewDate(todayISO()) }}
            className="text-xs text-accent hover:underline"
          >
            Schedule a follow-up
          </button>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="pt-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={!newDate || addReminder.isPending}
              className="text-sm px-4 py-1.5 rounded-xl text-white font-medium transition-opacity disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              Add reminder
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

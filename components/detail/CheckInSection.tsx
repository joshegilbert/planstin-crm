'use client'
import { useState } from 'react'
import type { Group, NoteType } from '@/types'
import { fmt, todayISO, addInterval, daysUntil } from '@/lib/dates'
import { Modal } from '@/components/ui/Modal'
import { useCheckInHistory, useLogCheckIn, useDeleteCheckIn } from '@/hooks/useCheckInHistory'

interface CheckInSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
  onAddNote: (args: { text: string; type: NoteType }) => void
}

const GUIDED_FIELDS = [
  { key: 'business', label: 'Business / changes' },
  { key: 'service', label: 'Service feedback (HYS)' },
  { key: 'staffing', label: 'FTE / staffing' },
  { key: 'nho', label: 'New hire orientation' },
  { key: 'product', label: 'Product interest' },
  { key: 'needs', label: 'Agreed-upon needs' },
  { key: 'claims', label: 'Claims / Rx' },
]

const CADENCE_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'custom', label: 'Custom' },
]

export function CheckInSection({ group, onUpdate, onAddNote }: CheckInSectionProps) {
  const [guidedOpen, setGuidedOpen] = useState(false)
  const [guidedFields, setGuidedFields] = useState<Record<string, string>>({})

  const { data: history = [] } = useCheckInHistory(group.id)
  const logCheckIn = useLogCheckIn(group.id)
  const deleteCheckIn = useDeleteCheckIn(group.id)

  function computeNext(cadence: string, days?: number | null, from?: string | null): string | null {
    return addInterval(from || todayISO(), cadence, days)
  }

  function handleCadenceChange(cadence: string) {
    const next = computeNext(cadence, group.customCadenceDays, group.lastCheckIn)
    onUpdate({ cadence: cadence as Group['cadence'], nextCheckIn: next })
  }

  function handleCustomDaysChange(days: number) {
    const next =
      group.cadence === 'custom' ? computeNext('custom', days, group.lastCheckIn) : group.nextCheckIn
    onUpdate({ customCadenceDays: days, nextCheckIn: next })
  }

  function handleQuickLog() {
    const today = todayISO()
    const next = computeNext(group.cadence, group.customCadenceDays, today)
    onUpdate({ lastCheckIn: today, nextCheckIn: next })
    onAddNote({ type: 'Check-in', text: 'Check-in completed.' })
    logCheckIn.mutate({ checkedIn: today, source: 'manual' })
  }

  function handleGuidedSave() {
    const bullets = GUIDED_FIELDS
      .filter((f) => guidedFields[f.key]?.trim())
      .map((f) => `${f.label}: ${guidedFields[f.key].trim()}`)
      .join('\n')
    const noteText = bullets || 'Guided check-in completed.'
    const today = todayISO()
    const next = computeNext(group.cadence, group.customCadenceDays, today)
    onAddNote({ type: 'Check-in', text: noteText })
    onUpdate({ lastCheckIn: today, nextCheckIn: next })
    logCheckIn.mutate({ checkedIn: today, source: 'guided' })
    setGuidedFields({})
    setGuidedOpen(false)
  }

  function handleDeleteMostRecent() {
    const mostRecent = history[0]
    if (!mostRecent) return
    deleteCheckIn.mutate(mostRecent.id, {
      onSuccess: () => {
        const remaining = history.slice(1)
        const prevDate = remaining[0]?.checkedIn || null
        onUpdate({ lastCheckIn: prevDate })
      },
    })
  }

  const nextDays = daysUntil(group.nextCheckIn)
  const nextIsOverdue = nextDays != null && nextDays < 0
  const nextIsSoon = nextDays != null && nextDays >= 0 && nextDays <= 7

  const nextColor = nextIsOverdue
    ? 'oklch(0.47 0.16 30)'
    : nextIsSoon
    ? 'oklch(0.46 0.11 65)'
    : 'oklch(0.40 0.09 155)'

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      <h2 className="font-semibold text-ink text-sm mb-3">Check-in cadence</h2>

      {/* Next check-in badge */}
      {group.nextCheckIn && (
        <div
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full mb-4"
          style={{ background: nextIsOverdue ? 'oklch(0.95 0.035 30)' : nextIsSoon ? 'oklch(0.96 0.05 80)' : 'oklch(0.95 0.04 155)', color: nextColor }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75}>
            <rect x="2" y="3" width="12" height="11" rx="2" />
            <path d="M5 1v3M11 1v3M2 7h12" strokeLinecap="round" />
          </svg>
          Next: {fmt(group.nextCheckIn)}
          {nextIsOverdue && ` — overdue ${Math.abs(nextDays!)}d`}
          {nextIsSoon && nextDays === 0 && ' — today'}
          {nextIsSoon && nextDays! > 0 && ` — in ${nextDays}d`}
        </div>
      )}

      <div className="space-y-3">
        {/* Cadence pill selector */}
        <div>
          <label className="block text-xs text-ink-faint mb-1.5">Cadence</label>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleCadenceChange('')}
              className="text-xs px-3 py-1 rounded-lg border transition-colors"
              style={
                !group.cadence
                  ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }
                  : { borderColor: 'var(--border)', color: 'var(--text-muted)' }
              }
            >
              Not set
            </button>
            {CADENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleCadenceChange(opt.value)}
                className="text-xs px-3 py-1 rounded-lg border transition-colors"
                style={
                  group.cadence === opt.value
                    ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }
                    : { borderColor: 'var(--border)', color: 'var(--text-muted)' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {group.cadence === 'custom' && (
          <div>
            <label className="block text-xs text-ink-faint mb-1">Every (days)</label>
            <input
              type="number"
              value={group.customCadenceDays ?? ''}
              min={1}
              onChange={(e) => handleCustomDaysChange(Number(e.target.value))}
              className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. 45"
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-ink-faint mb-1">Next check-in</label>
          <input
            type="date"
            value={group.nextCheckIn || ''}
            onChange={(e) => onUpdate({ nextCheckIn: e.target.value || null })}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleQuickLog}
            className="flex-1 text-sm px-3 py-2 rounded-xl font-medium text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            Log check-in (today)
          </button>
          <button
            onClick={() => setGuidedOpen(true)}
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-line text-ink-faint hover:text-ink hover:border-ink-faint transition-colors"
          >
            Guided
          </button>
        </div>

        {/* Check-in history */}
        {history.length > 0 && (
          <div className="pt-2 border-t border-line">
            <p className="text-xs text-ink-faint mb-1.5">Recent</p>
            <div className="space-y-1">
              {history.slice(0, 5).map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <span className="text-xs text-ink">{fmt(entry.checkedIn)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-faint capitalize">{entry.source}</span>
                    {i === 0 && (
                      <button
                        onClick={handleDeleteMostRecent}
                        className="text-xs text-ink-faint hover:text-red-500 transition-colors"
                        title="Remove most recent"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && group.lastCheckIn && (
          <div className="flex items-center justify-between pt-2 border-t border-line">
            <span className="text-xs text-ink-faint">Last check-in</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink">{fmt(group.lastCheckIn)}</span>
              <button
                onClick={() => onUpdate({ lastCheckIn: null })}
                className="text-xs text-ink-faint hover:text-red-500 transition-colors"
                title="Clear last check-in"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal open={guidedOpen} onClose={() => setGuidedOpen(false)} title="Guided check-in">
        <div className="space-y-4">
          {GUIDED_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-ink-faint mb-1">{f.label}</label>
              <textarea
                rows={2}
                value={guidedFields[f.key] || ''}
                onChange={(e) =>
                  setGuidedFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder="Notes..."
                className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setGuidedOpen(false)}
              className="text-sm px-4 py-2 rounded-xl border border-line text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGuidedSave}
              className="text-sm px-4 py-2 rounded-xl text-white font-medium"
              style={{ background: 'var(--accent)' }}
            >
              Save check-in
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

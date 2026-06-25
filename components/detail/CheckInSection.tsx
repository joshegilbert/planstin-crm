'use client'
import { useState } from 'react'
import type { Group, NoteType } from '@/types'
import { fmt, todayISO, addInterval } from '@/lib/dates'
import { Modal } from '@/components/ui/Modal'

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

export function CheckInSection({ group, onUpdate, onAddNote }: CheckInSectionProps) {
  const [guidedOpen, setGuidedOpen] = useState(false)
  const [guidedFields, setGuidedFields] = useState<Record<string, string>>({})

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
  }

  function handleGuidedSave() {
    const bullets = GUIDED_FIELDS
      .filter((f) => guidedFields[f.key]?.trim())
      .map((f) => `• ${f.label}: ${guidedFields[f.key].trim()}`)
      .join('\n')
    const noteText = bullets || 'Guided check-in completed.'
    const today = todayISO()
    const next = computeNext(group.cadence, group.customCadenceDays, today)
    onAddNote({ type: 'Check-in', text: noteText })
    onUpdate({ lastCheckIn: today, nextCheckIn: next })
    setGuidedFields({})
    setGuidedOpen(false)
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      <h2 className="font-semibold text-ink text-sm mb-4">Check-in cadence</h2>

      <div className="space-y-3">
        {/* Cadence select */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">Cadence</label>
          <select
            value={group.cadence}
            onChange={(e) => handleCadenceChange(e.target.value)}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">Not set</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Custom days */}
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

        {/* Last check-in */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-faint">Last check-in</span>
          <span className="text-sm text-ink">
            {group.lastCheckIn ? fmt(group.lastCheckIn) : 'Never'}
          </span>
        </div>

        {/* Next check-in */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">Next check-in</label>
          <input
            type="date"
            value={group.nextCheckIn || ''}
            onChange={(e) => onUpdate({ nextCheckIn: e.target.value || null })}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleQuickLog}
            className="flex-1 text-sm px-3 py-2 rounded-xl font-medium text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            ✓ Quick log (today)
          </button>
          <button
            onClick={() => setGuidedOpen(true)}
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-line text-ink-faint hover:text-ink hover:border-ink-faint transition-colors"
          >
            Guided check-in →
          </button>
        </div>
      </div>

      {/* Guided check-in modal */}
      <Modal
        open={guidedOpen}
        onClose={() => setGuidedOpen(false)}
        title="Guided check-in"
      >
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

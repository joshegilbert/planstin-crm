'use client'
import type { Group } from '@/types'
import { daysUntil } from '@/lib/dates'

interface FollowUpSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

export function FollowUpSection({ group, onUpdate }: FollowUpSectionProps) {
  const du = daysUntil(group.followUpDate)

  const duColor =
    du == null
      ? 'var(--text-muted)'
      : du < 0
      ? 'oklch(0.47 0.16 30)'
      : du === 0
      ? 'oklch(0.46 0.11 65)'
      : 'oklch(0.42 0.09 155)'

  const duLabel =
    du == null
      ? null
      : du < 0
      ? `Overdue by ${Math.abs(du)} day${Math.abs(du) === 1 ? '' : 's'}`
      : du === 0
      ? 'Due today'
      : `Due in ${du} day${du === 1 ? '' : 's'}`

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink text-sm">Follow-up reminder</h2>
        {duLabel && (
          <span className="text-xs font-medium" style={{ color: duColor }}>
            {duLabel}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Follow-up date */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">Date</label>
          <input
            type="date"
            value={group.followUpDate || ''}
            onChange={(e) => onUpdate({ followUpDate: e.target.value || null })}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Follow-up note */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">Note</label>
          <input
            type="text"
            value={group.followUpNote}
            onChange={(e) => onUpdate({ followUpNote: e.target.value })}
            placeholder="What for?"
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Clear button */}
        {(group.followUpDate || group.followUpNote) && (
          <button
            onClick={() => onUpdate({ followUpDate: null, followUpNote: '' })}
            className="text-xs text-ink-faint hover:text-red-500 transition-colors"
          >
            Clear reminder
          </button>
        )}
      </div>
    </div>
  )
}

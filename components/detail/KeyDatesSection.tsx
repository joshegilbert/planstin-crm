'use client'
import { useState } from 'react'
import type { Group } from '@/types'
import { fmt, daysUntil } from '@/lib/dates'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface KeyDatesSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

const inputClass =
  'text-sm border border-line rounded-lg px-2 py-1 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30'
const labelClass = 'block text-xs text-ink-faint mb-1'

interface DateRowProps {
  label: string
  value: string | null
  onChange: (v: string | null) => void
  historical?: boolean
}

function DateRow({ label, value, onChange, historical }: DateRowProps) {
  const du = daysUntil(value)
  const overdue = !historical && du != null && du < 0
  const soon = !historical && du != null && du >= 0 && du <= 30

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className={inputClass + ' w-full'}
      />
      {value && (
        <span
          className="text-xs mt-0.5 block"
          style={{ color: overdue ? 'oklch(0.47 0.16 30)' : soon ? 'oklch(0.46 0.11 65)' : 'var(--text-muted)' }}
        >
          {fmt(value)}
          {overdue && ` · ${Math.abs(du!)}d overdue`}
          {soon && du! > 0 && ` · in ${du}d`}
          {du === 0 && ' · today'}
        </span>
      )}
    </div>
  )
}

export function KeyDatesSection({ group, onUpdate }: KeyDatesSectionProps) {
  const [editing, setEditing] = useState(false)

  const dateDefs = [
    { label: 'Start date', value: group.startDate, historical: true },
    { label: 'Renewal', value: group.renewalDate },
    { label: 'Handoff window start', value: group.handoffWindowStart },
    { label: 'Handoff window end', value: group.handoffWindowEnd },
    { label: 'Full ownership', value: group.fullOwnership },
    { label: 'Commission effective', value: group.commissionEffective },
    { label: 'Warm hand-off date', value: group.warmHandoffDate },
    { label: 'Intro email sent', value: group.introEmailDate },
  ]

  const filledDates = dateDefs.filter((d) => d.value)
  const hasData = filledDates.length > 0

  if (!editing) {
    return (
      <CollapsibleSection title="Key dates" sectionKey="key-dates" defaultOpen={true}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {!hasData ? (
              <p className="text-sm text-ink-faint py-1">No dates set</p>
            ) : (
              <dl className="space-y-2">
                {filledDates.map(({ label, value, historical }) => {
                  const du = daysUntil(value)
                  const overdue = !historical && du != null && du < 0
                  const soon = !historical && du != null && du >= 0 && du <= 30
                  return (
                    <div key={label} className="flex gap-3">
                      <dt className="text-xs text-ink-faint w-36 flex-shrink-0 pt-0.5">{label}</dt>
                      <dd className="flex items-center gap-2">
                        <span className="text-sm text-ink">{fmt(value!)}</span>
                        {(overdue || soon) && (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={
                              overdue
                                ? { background: 'oklch(0.95 0.035 30)', color: 'oklch(0.47 0.16 30)' }
                                : { background: 'oklch(0.96 0.05 80)', color: 'oklch(0.46 0.11 65)' }
                            }
                          >
                            {overdue ? `${Math.abs(du!)}d overdue` : du === 0 ? 'Today' : `in ${du}d`}
                          </span>
                        )}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-ink-faint hover:text-accent transition-colors flex-shrink-0"
          >
            {hasData ? 'Edit' : 'Add dates'}
          </button>
        </div>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Key dates" sectionKey="key-dates" defaultOpen={true}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ink-faint">Editing key dates</span>
        <button
          onClick={() => setEditing(false)}
          className="text-xs font-medium text-accent hover:underline"
        >
          Done
        </button>
      </div>

      <div className="space-y-4">
        <DateRow
          label="Start date"
          value={group.startDate}
          onChange={(v) => onUpdate({ startDate: v })}
          historical
        />
        <DateRow
          label="Renewal date"
          value={group.renewalDate}
          onChange={(v) => onUpdate({ renewalDate: v })}
        />
        <DateRow
          label="Handoff window start"
          value={group.handoffWindowStart}
          onChange={(v) => onUpdate({ handoffWindowStart: v })}
        />
        <DateRow
          label="Handoff window end"
          value={group.handoffWindowEnd}
          onChange={(v) => onUpdate({ handoffWindowEnd: v })}
        />
        <DateRow
          label="Full ownership"
          value={group.fullOwnership}
          onChange={(v) => onUpdate({ fullOwnership: v })}
        />
        <DateRow
          label="Commission effective"
          value={group.commissionEffective}
          onChange={(v) => onUpdate({ commissionEffective: v })}
        />
        <DateRow
          label="Warm hand-off date"
          value={group.warmHandoffDate}
          onChange={(v) => onUpdate({ warmHandoffDate: v })}
        />
        <DateRow
          label="Intro email sent"
          value={group.introEmailDate}
          onChange={(v) => onUpdate({ introEmailDate: v })}
        />
      </div>
    </CollapsibleSection>
  )
}

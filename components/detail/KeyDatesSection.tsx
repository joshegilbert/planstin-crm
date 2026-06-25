'use client'
import type { Group } from '@/types'
import { fmt } from '@/lib/dates'

interface KeyDatesSectionProps {
  group: Group
}

interface DateRow {
  label: string
  value: string
}

export function KeyDatesSection({ group }: KeyDatesSectionProps) {
  const rows: DateRow[] = [
    { label: 'Renewal date', value: fmt(group.renewalDate) },
    { label: 'Full ownership', value: fmt(group.fullOwnership) },
    { label: 'Commission effective', value: fmt(group.commissionEffective) },
    {
      label: 'Hand-off window',
      value: group.warmHandoffDate ? fmt(group.warmHandoffDate) : '—',
    },
  ]

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
      <h2 className="font-semibold text-ink text-sm mb-4">Key dates</h2>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-ink-faint">{row.label}</span>
            <span className="text-sm text-ink font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

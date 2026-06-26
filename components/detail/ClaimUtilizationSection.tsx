'use client'
import { useState } from 'react'
import type { ClaimLogEntry } from '@/types'
import { fmt, todayISO } from '@/lib/dates'
import { useClaimLog, useAddClaimEntry, useDeleteClaimEntry } from '@/hooks/useClaimLog'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface ClaimUtilizationSectionProps {
  groupId: string
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + n.toFixed(0)
}

function utilizationPct(entry: ClaimLogEntry): string {
  if (!entry.claimsFund || entry.claimsFund === 0) return '—'
  const pct = (entry.claimsPaid / entry.claimsFund) * 100
  return pct.toFixed(1) + '%'
}

function utilizationColor(entry: ClaimLogEntry): string {
  if (!entry.claimsFund || entry.claimsFund === 0) return 'var(--text-muted)'
  const pct = (entry.claimsPaid / entry.claimsFund) * 100
  if (pct >= 90) return 'oklch(0.47 0.16 30)'
  if (pct >= 75) return 'oklch(0.46 0.11 65)'
  return 'oklch(0.42 0.09 155)'
}

const inputClass =
  'w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30'
const labelClass = 'block text-xs text-ink-faint mb-1'

export function ClaimUtilizationSection({ groupId }: ClaimUtilizationSectionProps) {
  const { data: entries = [] } = useClaimLog(groupId)
  const addEntry = useAddClaimEntry(groupId)
  const deleteEntry = useDeleteClaimEntry(groupId)

  const [showForm, setShowForm] = useState(false)
  const [logDate, setLogDate] = useState(todayISO())
  const [claimsPaid, setClaimsPaid] = useState('')
  const [claimsFund, setClaimsFund] = useState('')
  const [note, setNote] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function handleAdd() {
    if (!logDate || !claimsPaid || !claimsFund) return
    addEntry.mutate(
      {
        logDate,
        claimsPaid: Number(claimsPaid),
        claimsFund: Number(claimsFund),
        note,
      },
      {
        onSuccess: () => {
          setLogDate(todayISO())
          setClaimsPaid('')
          setClaimsFund('')
          setNote('')
          setShowForm(false)
        },
      },
    )
  }

  const latest = entries[0]

  return (
    <CollapsibleSection title="Claim utilization" sectionKey="claim-utilization" defaultOpen={false}>
      {/* Current utilization summary */}
      {latest && (
        <div className="mb-4 p-3 rounded-xl bg-canvas-subtle border border-line">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-ink-faint">Most recent ({fmt(latest.logDate)})</span>
            <span
              className="text-sm font-semibold"
              style={{ color: utilizationColor(latest) }}
            >
              {utilizationPct(latest)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-faint">
            <span>Paid: <span className="text-ink">{formatCurrency(latest.claimsPaid)}</span></span>
            <span>Fund: <span className="text-ink">{formatCurrency(latest.claimsFund)}</span></span>
          </div>
          {latest.note && <p className="text-xs text-ink-faint mt-1">{latest.note}</p>}
        </div>
      )}

      {/* Log table */}
      {entries.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-x-3 gap-y-1 text-xs">
            <span className="text-ink-faint font-medium">Date</span>
            <span className="text-ink-faint font-medium">Paid</span>
            <span className="text-ink-faint font-medium">Fund</span>
            <span className="text-ink-faint font-medium">Util %</span>
            <span />
            {entries.map((entry) => (
              confirmDeleteId === entry.id ? (
                <div key={entry.id} className="col-span-5 flex items-center gap-2 py-0.5">
                  <span className="text-xs text-ink-faint">Remove this entry?</span>
                  <button onClick={() => { deleteEntry.mutate(entry.id); setConfirmDeleteId(null) }}
                    className="text-xs text-red-500 hover:underline">Yes</button>
                  <button onClick={() => setConfirmDeleteId(null)}
                    className="text-xs text-ink-faint hover:text-ink">Cancel</button>
                </div>
              ) : (
                <>
                  <span key={entry.id + 'd'} className="text-ink py-0.5">{fmt(entry.logDate)}</span>
                  <span key={entry.id + 'p'} className="text-ink py-0.5">{formatCurrency(entry.claimsPaid)}</span>
                  <span key={entry.id + 'f'} className="text-ink py-0.5">{formatCurrency(entry.claimsFund)}</span>
                  <span key={entry.id + 'u'} className="font-medium py-0.5"
                    style={{ color: utilizationColor(entry) }}>
                    {utilizationPct(entry)}
                  </span>
                  <button key={entry.id + 'x'}
                    onClick={() => setConfirmDeleteId(entry.id)}
                    className="text-ink-faint hover:text-red-500 transition-colors py-0.5">
                    Remove
                  </button>
                </>
              )
            ))}
          </div>
        </div>
      )}

      {/* Add entry form */}
      {showForm ? (
        <div className="space-y-3 p-3 rounded-xl border border-line bg-canvas-subtle">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <div className="col-span-2">
              <label className={labelClass}>Log date</label>
              <input type="date" value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Claims paid ($)</label>
              <input type="number" value={claimsPaid}
                onChange={(e) => setClaimsPaid(e.target.value)}
                className={inputClass} placeholder="0.00" min="0" step="0.01" />
            </div>
            <div>
              <label className={labelClass}>Claims fund ($)</label>
              <input type="number" value={claimsFund}
                onChange={(e) => setClaimsFund(e.target.value)}
                className={inputClass} placeholder="0.00" min="0" step="0.01" />
            </div>
            {claimsPaid && claimsFund && Number(claimsFund) > 0 && (
              <div className="col-span-2 text-xs text-ink-faint">
                Utilization:{' '}
                <span className="font-medium text-ink">
                  {((Number(claimsPaid) / Number(claimsFund)) * 100).toFixed(1)}%
                </span>
              </div>
            )}
            <div className="col-span-2">
              <label className={labelClass}>Note (optional)</label>
              <input type="text" value={note}
                onChange={(e) => setNote(e.target.value)}
                className={inputClass} placeholder="Context or observations" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!logDate || !claimsPaid || !claimsFund || addEntry.isPending}
              className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              Save entry
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs px-3 py-1.5 rounded-lg border border-line text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-accent hover:underline"
        >
          + Log utilization entry
        </button>
      )}
    </CollapsibleSection>
  )
}

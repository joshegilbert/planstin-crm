'use client'
import type { Group } from '@/types'
import { fmt, todayISO } from '@/lib/dates'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useAddNote } from '@/hooks/useNotes'

interface WatchOutsSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

export function WatchOutsSection({ group, onUpdate }: WatchOutsSectionProps) {
  const addNote = useAddNote(group.id)

  function handleLogMonitor() {
    const today = todayISO()
    addNote.mutate({ type: 'Monitor', text: 'Monthly monitor completed.' })
    onUpdate({ lastMonitor: today })
  }

  return (
    <CollapsibleSection title="Watch-outs & monitoring" sectionKey="watch-outs" defaultOpen={true}>
      <div className="space-y-4">
        {/* Watch-out textarea */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">Critical watch-out</label>
          <textarea
            rows={3}
            value={group.watchOuts}
            onChange={(e) => onUpdate({ watchOuts: e.target.value })}
            placeholder="Any critical concerns or flags..."
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Monitor monthly */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
              style={
                group.monitorMonthly
                  ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
                  : { borderColor: 'var(--border)' }
              }
              onClick={() => onUpdate({ monitorMonthly: !group.monitorMonthly })}
            >
              {group.monitorMonthly && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  viewBox="0 0 10 10"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M1.5 5l2.5 2.5 4.5-4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <label
              className="text-sm text-ink cursor-pointer select-none"
              onClick={() => onUpdate({ monitorMonthly: !group.monitorMonthly })}
            >
              Monitor monthly
            </label>
          </div>

          {group.monitorMonthly && (
            <div className="ml-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-faint">Last monitor</span>
                <span className="text-sm text-ink">
                  {group.lastMonitor ? fmt(group.lastMonitor) : 'Never'}
                </span>
              </div>
              <button
                onClick={handleLogMonitor}
                disabled={addNote.isPending}
                className="w-full text-sm px-3 py-2 rounded-xl border border-line text-ink-faint hover:text-ink hover:border-ink-faint transition-colors"
              >
                Log monitor
              </button>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  )
}

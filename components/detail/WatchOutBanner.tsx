'use client'
import type { Group, GroupViewModel } from '@/types'
import { todayISO } from '@/lib/dates'
import { useAddNote } from '@/hooks/useNotes'

interface WatchOutBannerProps {
  group: Group
  vm: GroupViewModel
  onUpdate: (patch: Partial<Group>) => void
}

export function WatchOutBanner({ group, vm, onUpdate }: WatchOutBannerProps) {
  const addNote = useAddNote(group.id)

  if (!group.watchOuts) return null

  function handleLogMonitor() {
    const today = todayISO()
    addNote.mutate({ type: 'Monitor', text: 'Monthly monitor completed.' })
    onUpdate({ lastMonitor: today })
  }

  return (
    <div
      className="rounded-xl p-4 mb-4 border"
      style={{
        background: 'oklch(0.96 0.05 80)',
        borderColor: 'oklch(0.88 0.1 80)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'oklch(0.46 0.11 65)' }}
            >
              ⚠ Watch-out
            </span>
          </div>
          <p className="text-sm" style={{ color: 'oklch(0.35 0.08 65)' }}>
            {group.watchOuts}
          </p>
          {vm.monitorDue && (
            <p
              className="text-xs mt-2 font-medium"
              style={{ color: 'oklch(0.47 0.16 30)' }}
            >
              Monthly monitor due — confirm enrolled count
            </p>
          )}
        </div>
        {vm.monitorDue && (
          <button
            onClick={handleLogMonitor}
            disabled={addNote.isPending}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{
              background: 'oklch(0.46 0.11 65)',
              color: '#fff',
            }}
          >
            Log monitor
          </button>
        )}
      </div>
    </div>
  )
}

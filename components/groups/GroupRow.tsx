'use client'
import { useRouter } from 'next/navigation'
import { useUpdateGroup } from '@/hooks/useGroups'
import StatusBadge from '@/components/ui/StatusBadge'
import { fmt, daysUntil } from '@/lib/dates'
import type { GroupViewModel } from '@/types'

interface GroupRowProps {
  group: GroupViewModel
}

const oeWindowBadge: Record<string, { label: string; cls: string }> = {
  now: { label: 'Now', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  soon: { label: 'Soon', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  passed: { label: 'Passed', cls: 'bg-canvas-subtle text-ink-faint' },
  future: { label: '', cls: '' },
  none: { label: '', cls: '' },
}

export default function GroupRow({ group: g }: GroupRowProps) {
  const router = useRouter()
  const updateGroup = useUpdateGroup()

  function handlePriorityToggle(e: React.MouseEvent) {
    e.stopPropagation()
    updateGroup.mutate({ id: g.id, patch: { priority: !g.priority } })
  }

  const nextContact = g.followUpDate || g.nextCheckIn
  const nextContactDays = daysUntil(nextContact)
  const nextContactOverdue = nextContactDays !== null && nextContactDays < 0

  const oeBadge = oeWindowBadge[g.oeWindow]

  return (
    <div
      onClick={() => router.push(`/groups/${g.id}`)}
      className="flex items-center gap-3 px-4 py-3 border-b border-line hover:bg-canvas-subtle cursor-pointer transition-colors"
    >
      {/* Group name */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-ink truncate">{g.groupName}</div>
        {g.status === 'transition' && g.transitionStep && (
          <div className="text-xs text-ink-faint truncate">{g.transitionStep}</div>
        )}
      </div>

      {/* From BM */}
      <div className="text-sm text-ink-faint truncate" style={{ width: 120, flexShrink: 0 }}>
        {g.currentBM || '—'}
      </div>

      {/* Open enrollment */}
      <div style={{ width: 140, flexShrink: 0 }}>
        <div className="text-xs text-ink-faint">{g.oeDateText}</div>
        {oeBadge.label && (
          <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${oeBadge.cls}`}>
            {oeBadge.label}
          </span>
        )}
      </div>

      {/* Workflows */}
      <div style={{ width: 130, flexShrink: 0 }}>
        {g.wfTotalAll > 0 ? (
          <div>
            <div className="h-1.5 w-full bg-line rounded-full overflow-hidden mb-1">
              <div
                className="bg-accent h-full transition-all"
                style={{ width: `${g.wfPct}%` }}
              />
            </div>
            <div className="text-xs text-ink-faint">
              {g.wfDoneAll}/{g.wfTotalAll} tasks
            </div>
          </div>
        ) : (
          <span className="text-xs text-ink-faint">—</span>
        )}
      </div>

      {/* Next contact */}
      <div style={{ width: 120, flexShrink: 0 }}>
        {nextContact ? (
          <span className={`text-xs ${nextContactOverdue ? 'text-[oklch(0.47_0.16_30)] font-medium' : 'text-ink-faint'}`}>
            {fmt(nextContact)}
          </span>
        ) : (
          <span className="text-xs text-ink-faint">—</span>
        )}
      </div>

      {/* Status */}
      <div style={{ width: 130, flexShrink: 0 }}>
        <StatusBadge status={g.status} />
      </div>

      {/* Priority star */}
      <div style={{ width: 44, flexShrink: 0 }} className="flex justify-center">
        <button
          onClick={handlePriorityToggle}
          className="text-base hover:scale-110 transition-transform"
          title={g.priority ? 'Remove flag' : 'Flag group'}
        >
          {g.priority ? '⭐' : '☆'}
        </button>
      </div>
    </div>
  )
}

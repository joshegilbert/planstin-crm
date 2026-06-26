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

  const handoffDate = g.commissionEffective || g.fullOwnership || g.warmHandoffDate
  const handoffDays = daysUntil(handoffDate)

  const reachOutColor: Record<string, string> = {
    urgent: 'oklch(0.47 0.16 30)',
    warn: 'oklch(0.55 0.13 65)',
    accent: 'var(--accent)',
    neutral: 'var(--text-muted)',
  }

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
      <div className="text-xs text-ink-faint truncate" style={{ width: 100, flexShrink: 0 }}>
        {g.currentBM || '—'}
      </div>

      {/* Handoff */}
      <div style={{ width: 110, flexShrink: 0 }}>
        {handoffDate ? (
          <>
            <div className="text-xs text-ink">{fmt(handoffDate)}</div>
            {handoffDays !== null && (
              <div className="text-[10px] text-ink-faint">
                {handoffDays < 0
                  ? `${Math.abs(handoffDays)}d ago`
                  : handoffDays === 0
                  ? 'today'
                  : `in ${handoffDays}d`}
              </div>
            )}
          </>
        ) : (
          <span className="text-xs text-ink-faint">—</span>
        )}
      </div>

      {/* Reach-out */}
      <div style={{ width: 130, flexShrink: 0 }}>
        {g.dueText ? (
          <span className="text-xs font-medium" style={{ color: reachOutColor[g.dueTone] }}>
            {g.dueText}
          </span>
        ) : (
          <span className="text-xs text-ink-faint">—</span>
        )}
      </div>

      {/* Open enrollment */}
      <div style={{ width: 120, flexShrink: 0 }}>
        <div className="text-xs text-ink-faint">{g.oeDateText !== 'Dates not set' ? g.oeDateText : '—'}</div>
        {oeBadge.label && (
          <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${oeBadge.cls}`}>
            {oeBadge.label}
          </span>
        )}
      </div>

      {/* Next contact */}
      <div style={{ width: 110, flexShrink: 0 }}>
        {nextContact ? (
          <span className={`text-xs ${nextContactOverdue ? 'text-[oklch(0.47_0.16_30)] font-medium' : 'text-ink-faint'}`}>
            {fmt(nextContact)}
          </span>
        ) : (
          <span className="text-xs text-ink-faint">—</span>
        )}
      </div>

      {/* Status */}
      <div style={{ width: 120, flexShrink: 0 }}>
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

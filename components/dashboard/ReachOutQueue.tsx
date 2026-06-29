'use client'
import { useRouter } from 'next/navigation'
import { useUpdateGroup } from '@/hooks/useGroups'
import { isoPlus, todayISO } from '@/lib/dates'
import type { GroupViewModel } from '@/types'

interface ReachOutQueueProps {
  groups: GroupViewModel[]
  loading?: boolean
}

const toneClasses: Record<string, { bg: string; text: string }> = {
  urgent: {
    bg: 'bg-[oklch(0.95_0.035_30)]',
    text: 'text-[oklch(0.47_0.16_30)]',
  },
  warn: {
    bg: 'bg-[oklch(0.96_0.05_80)]',
    text: 'text-[oklch(0.46_0.11_65)]',
  },
  accent: {
    bg: 'bg-[oklch(0.95_0.03_250)]',
    text: 'text-[oklch(0.44_0.11_255)]',
  },
  neutral: {
    bg: 'bg-[#f0eee8]',
    text: 'text-[#6f6c66]',
  },
}

const dueToneText: Record<string, string> = {
  urgent: 'text-[oklch(0.47_0.16_30)]',
  warn: 'text-[oklch(0.46_0.11_65)]',
  accent: 'text-[oklch(0.44_0.11_255)]',
  neutral: 'text-ink-faint',
}

export default function ReachOutQueue({ groups, loading }: ReachOutQueueProps) {
  const router = useRouter()
  const updateGroup = useUpdateGroup()

  function handleSnooze(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const snoozeUntil = isoPlus(todayISO(), 7)
    updateGroup.mutate({ id, patch: { snoozedUntil: snoozeUntil } })
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-semibold text-ink">Reach out to</h2>
        {groups.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-faint font-medium">
            {groups.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-faint text-sm">
          Loading…
        </div>
      ) : groups.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-ink-faint text-sm italic">
          All clear — no groups need attention right now.
        </div>
      ) : (
        <div className="space-y-1">
          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => router.push(`/groups/${g.id}?from=dashboard`)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-canvas-subtle cursor-pointer transition-colors group"
            >
              {/* Left: name + meta */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-ink truncate">{g.groupName}</div>
                <div className="text-xs text-ink-faint truncate">
                  {g.currentBM && `from ${g.currentBM}`}
                  {g.currentBM && g.renewalSub && ' · '}
                  {g.renewalSub && `renews ${g.renewalSub}`}
                </div>
              </div>

              {/* Middle: reason tags */}
              <div className="flex flex-wrap gap-1 shrink-0">
                {g.reasons.slice(0, 3).map((r, i) => {
                  const cls = toneClasses[r.tone] || toneClasses.neutral
                  return (
                    <span
                      key={i}
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${cls.bg} ${cls.text}`}
                    >
                      {r.label}
                    </span>
                  )
                })}
              </div>

              {/* Right: dueText + snooze */}
              <div className="flex items-center gap-2 shrink-0">
                {g.dueText && (
                  <span className={`text-xs font-medium whitespace-nowrap ${dueToneText[g.dueTone] || 'text-ink-faint'}`}>
                    {g.dueText}
                  </span>
                )}
                <button
                  onClick={(e) => handleSnooze(e, g.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-ink-faint hover:text-ink px-1"
                  title="Snooze 7 days"
                >
                  💤
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

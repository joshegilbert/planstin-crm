'use client'
import { useRouter } from 'next/navigation'
import { fmt } from '@/lib/dates'
import type { GroupViewModel } from '@/types'

interface OeCardProps {
  nowGroups: GroupViewModel[]
  soonGroups: GroupViewModel[]
}

const MAX = 4

function OeSection({
  title,
  groups,
  emptyText,
  filter,
}: {
  title: string
  groups: GroupViewModel[]
  emptyText: string
  filter: string
}) {
  const router = useRouter()
  const shown = groups.slice(0, MAX)
  const extra = groups.length - MAX

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">{title}</span>
        {groups.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-faint font-medium">
            {groups.length}
          </span>
        )}
      </div>
      {groups.length === 0 ? (
        <p className="text-xs text-ink-faint italic">{emptyText}</p>
      ) : (
        <div className="space-y-1">
          {shown.map((g) => (
            <div
              key={g.id}
              onClick={() => router.push(`/groups/${g.id}`)}
              className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors"
            >
              <span className="text-sm text-ink font-medium truncate">{g.groupName}</span>
              <span className="flex items-center gap-1.5 flex-shrink-0">
                {!g.oeStartDate && (
                  <span
                    className="text-[9px] px-1 py-0.5 rounded bg-canvas-subtle text-ink-faint"
                    title="No confirmed OE dates — using renewal date as estimate"
                  >
                    Dates not set
                  </span>
                )}
                <span className="text-xs text-ink-faint whitespace-nowrap">{fmt(g.renewalDate)}</span>
              </span>
            </div>
          ))}
          {extra > 0 && (
            <button
              onClick={() => router.push(`/groups?filter=${filter}`)}
              className="text-xs text-accent hover:underline pt-1"
            >
              + {extra} more
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function OeCard({ nowGroups, soonGroups }: OeCardProps) {
  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5">
      <h3 className="font-semibold text-sm text-ink mb-3">Open enrollment</h3>
      {nowGroups.length === 0 && soonGroups.length === 0 ? (
        <p className="text-xs text-ink-faint italic">No groups currently in OE or within 90 days.</p>
      ) : (
        <div className="space-y-3">
          <OeSection title="Now" groups={nowGroups} emptyText="No groups currently in OE." filter="oenow" />
          <div className="border-t border-line" />
          <OeSection title="Soon" groups={soonGroups} emptyText="No groups within 90 days of OE." filter="oe90" />
        </div>
      )}
    </div>
  )
}

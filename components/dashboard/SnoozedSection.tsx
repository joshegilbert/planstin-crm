'use client'
import { useUIStore } from '@/lib/store'
import { useUpdateGroup } from '@/hooks/useGroups'
import { fmt } from '@/lib/dates'
import type { GroupViewModel } from '@/types'
import { useRouter } from 'next/navigation'

interface SnoozedSectionProps {
  groups: GroupViewModel[]
}

export default function SnoozedSection({ groups }: SnoozedSectionProps) {
  const router = useRouter()
  const { showSnoozed, setShowSnoozed } = useUIStore()
  const updateGroup = useUpdateGroup()

  if (groups.length === 0) return null

  function handleUnsnooze(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    updateGroup.mutate({ id, patch: { snoozedUntil: null } })
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowSnoozed(!showSnoozed)}
        className="flex items-center gap-2 mb-3 text-left group"
      >
        <span className="text-sm font-medium text-ink-faint group-hover:text-ink transition-colors">
          Snoozed ({groups.length})
        </span>
        <span className="text-xs text-ink-faint transition-transform duration-200" style={{ transform: showSnoozed ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          ▾
        </span>
      </button>

      {showSnoozed && (
        <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5">
          <div className="space-y-1">
            {groups.map((g) => (
              <div
                key={g.id}
                onClick={() => router.push(`/groups/${g.id}`)}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-canvas-subtle cursor-pointer transition-colors group/row"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{g.groupName}</div>
                  <div className="text-xs text-ink-faint">
                    Snoozed until {fmt(g.snoozedUntil)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleUnsnooze(e, g.id)}
                  className="opacity-0 group-hover/row:opacity-100 transition-opacity ml-3 text-ink-faint hover:text-ink text-lg leading-none px-1"
                  title="Unsnooze"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

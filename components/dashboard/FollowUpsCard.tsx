'use client'
import { useRouter } from 'next/navigation'
import type { GroupViewModel } from '@/types'

interface FollowUpsCardProps {
  groups: GroupViewModel[]
}

const MAX = 5

export default function FollowUpsCard({ groups }: FollowUpsCardProps) {
  const router = useRouter()
  const shown = groups.slice(0, MAX)
  const extra = groups.length - MAX

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-sm text-ink">Follow-ups</h3>
        {groups.length > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-faint font-medium">
            {groups.length}
          </span>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="text-xs text-ink-faint italic">No follow-ups due.</p>
      ) : (
        <div className="space-y-1">
          {shown.map((g) => (
            <div
              key={g.id}
              onClick={() => router.push(`/groups/${g.id}`)}
              className="flex items-start justify-between py-1.5 px-2 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink font-medium truncate">{g.groupName}</div>
                {g.followUpNote && (
                  <div className="text-xs text-ink-faint truncate">{g.followUpNote}</div>
                )}
              </div>
              <span className="text-xs text-[oklch(0.47_0.16_30)] whitespace-nowrap ml-2 font-medium">
                {g.followUpText}
              </span>
            </div>
          ))}
          {extra > 0 && (
            <button
              onClick={() => router.push('/groups?filter=followup')}
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

'use client'
import { useRouter } from 'next/navigation'
import { fmt } from '@/lib/dates'
import type { GroupViewModel } from '@/types'

interface OeNowCardProps {
  groups: GroupViewModel[]
}

const MAX = 5

export default function OeNowCard({ groups }: OeNowCardProps) {
  const router = useRouter()
  const shown = groups.slice(0, MAX)
  const extra = groups.length - MAX

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-sm text-ink">On open enrollment</h3>
        {groups.length > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-faint font-medium">
            {groups.length}
          </span>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="text-xs text-ink-faint italic">No groups currently in OE.</p>
      ) : (
        <div className="space-y-1">
          {shown.map((g) => (
            <div
              key={g.id}
              onClick={() => router.push(`/groups/${g.id}`)}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors"
            >
              <span className="text-sm text-ink font-medium truncate">{g.groupName}</span>
              <span className="text-xs text-ink-faint whitespace-nowrap ml-2">{fmt(g.renewalDate)}</span>
            </div>
          ))}
          {extra > 0 && (
            <button
              onClick={() => router.push('/groups?filter=oenow')}
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

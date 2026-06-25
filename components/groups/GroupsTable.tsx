'use client'
import GroupRow from './GroupRow'
import type { GroupViewModel } from '@/types'

interface GroupsTableProps {
  groups: GroupViewModel[]
  loading?: boolean
}

const columns = [
  { label: 'Group', flex: true },
  { label: 'From BM', width: 120 },
  { label: 'Open enrollment', width: 140 },
  { label: 'Workflows', width: 130 },
  { label: 'Next contact', width: 120 },
  { label: 'Status', width: 130 },
  { label: '★', width: 44 },
]

export default function GroupsTable({ groups, loading }: GroupsTableProps) {
  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm overflow-hidden">
      {/* Sticky header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-canvas-subtle sticky top-0 z-10">
        {columns.map((col) => (
          <div
            key={col.label}
            className={[
              'text-xs font-semibold text-ink-faint uppercase tracking-wide',
              col.flex ? 'flex-1 min-w-0' : '',
            ].join(' ')}
            style={col.width ? { width: col.width, flexShrink: 0 } : undefined}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-ink-faint text-sm">
          Loading…
        </div>
      ) : groups.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-ink-faint text-sm italic">
          No groups match this filter.
        </div>
      ) : (
        <div>
          {groups.map((g) => (
            <GroupRow key={g.id} group={g} />
          ))}
        </div>
      )}
    </div>
  )
}

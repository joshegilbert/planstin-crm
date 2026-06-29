'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { daysUntil } from '@/lib/dates'
import type { GroupViewModel, Reminder } from '@/types'

interface TodayItem {
  id: string
  groupId?: string
  groupName: string
  action: string
  urgency: 'overdue' | 'today'
  daysOverdue: number
}

interface Props {
  vms: GroupViewModel[]
  reminders: Reminder[]
}

export default function TodayPanel({ vms, reminders }: Props) {
  const router = useRouter()

  const items = useMemo<TodayItem[]>(() => {
    const out: TodayItem[] = []

    for (const g of vms) {
      if (g.snoozed) continue

      // Follow-up due or overdue
      if (g.followUpDate) {
        const d = daysUntil(g.followUpDate)
        if (d != null && d <= 0) {
          out.push({
            id: `fu-${g.id}`,
            groupId: g.id,
            groupName: g.groupName,
            action: g.followUpNote ? `Follow-up: ${g.followUpNote}` : 'Follow-up due',
            urgency: d < 0 ? 'overdue' : 'today',
            daysOverdue: d < 0 ? Math.abs(d) : 0,
          })
        }
      }

      // Check-in overdue
      if (g.checkInDue && g.nextCheckIn) {
        const d = daysUntil(g.nextCheckIn)
        if (d != null && d <= 0) {
          out.push({
            id: `ci-${g.id}`,
            groupId: g.id,
            groupName: g.groupName,
            action: 'Check-in overdue',
            urgency: 'overdue',
            daysOverdue: Math.abs(d),
          })
        }
      }

      // Monthly monitor due
      if (g.monitorDue) {
        out.push({
          id: `mon-${g.id}`,
          groupId: g.id,
          groupName: g.groupName,
          action: 'Monthly eligibility monitor due',
          urgency: 'today',
          daysOverdue: 0,
        })
      }
    }

    // Reminders due or overdue
    for (const r of reminders) {
      if (r.completed) continue
      const d = daysUntil(r.triggerDate)
      if (d != null && d <= 0) {
        out.push({
          id: `rem-${r.id}`,
          groupId: r.groupId ?? undefined,
          groupName: r.groupId ? 'Reminder' : (r.note || 'Personal reminder'),
          action: r.note || 'Reminder due',
          urgency: d < 0 ? 'overdue' : 'today',
          daysOverdue: d < 0 ? Math.abs(d) : 0,
        })
      }
    }

    // Sort: most overdue first, then today
    out.sort((a, b) => {
      if (a.urgency === 'overdue' && b.urgency === 'today') return -1
      if (a.urgency === 'today' && b.urgency === 'overdue') return 1
      return b.daysOverdue - a.daysOverdue
    })

    return out
  }, [vms, reminders])

  const overdueCount = items.filter((i) => i.urgency === 'overdue').length
  const todayCount = items.filter((i) => i.urgency === 'today').length

  if (items.length === 0) {
    return (
      <div className="bg-canvas rounded-2xl border border-line shadow-sm px-5 py-4 mb-6 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ background: '#f0fdf4', color: '#16a34a' }}
        >
          ✓
        </div>
        <div>
          <div className="font-semibold text-sm text-ink">All caught up!</div>
          <div className="text-xs text-ink-faint">Nothing overdue or due today. You&apos;re ahead of the game.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="font-semibold text-sm text-ink">Today&apos;s actions</h2>
        {overdueCount > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#fef2f2', color: '#991b1b' }}
          >
            {overdueCount} overdue
          </span>
        )}
        {todayCount > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#fffbeb', color: '#92400e' }}
          >
            {todayCount} due today
          </span>
        )}
      </div>

      <div className="space-y-0.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => item.groupId && router.push(`/groups/${item.groupId}?from=dashboard`)}
            className={[
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
              item.groupId ? 'cursor-pointer hover:bg-canvas-subtle' : '',
            ].join(' ')}
          >
            <span className="text-xs text-ink-faint w-5 text-right flex-shrink-0 font-medium tabular-nums">
              {idx + 1}.
            </span>
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: item.urgency === 'overdue' ? '#dc2626' : '#ca8a04' }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-ink">{item.groupName}</span>
              {item.action !== item.groupName && (
                <span className="text-xs text-ink-faint ml-2 truncate">{item.action}</span>
              )}
            </div>
            {item.urgency === 'overdue' ? (
              <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#dc2626' }}>
                {item.daysOverdue > 0 ? `${item.daysOverdue}d overdue` : 'Overdue'}
              </span>
            ) : (
              <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#ca8a04' }}>
                Due today
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

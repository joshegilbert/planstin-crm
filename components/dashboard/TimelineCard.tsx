'use client'
import { useRouter } from 'next/navigation'
import type { GroupViewModel } from '@/types'
import { daysUntil, fmt } from '@/lib/dates'

interface TimelineCardProps {
  groups: GroupViewModel[]
}

interface TimelineItem {
  groupId: string
  groupName: string
  date: string
  label: string
  tone: 'urgent' | 'warn' | 'accent' | 'neutral'
}

function collectItems(groups: GroupViewModel[]): TimelineItem[] {
  const items: TimelineItem[] = []

  for (const g of groups) {
    if (g.renewalDate) {
      const d = daysUntil(g.renewalDate)
      if (d != null && d >= 0 && d <= 90) {
        items.push({
          groupId: g.id,
          groupName: g.groupName,
          date: g.renewalDate,
          label: `Renewal (${fmt(g.renewalDate)})`,
          tone: d <= 30 ? 'urgent' : 'warn',
        })
      }
    }
    if (g.nextCheckIn) {
      const d = daysUntil(g.nextCheckIn)
      if (d != null && d >= 0 && d <= 90) {
        items.push({
          groupId: g.id,
          groupName: g.groupName,
          date: g.nextCheckIn,
          label: `Check-in (${fmt(g.nextCheckIn)})`,
          tone: d <= 7 ? 'warn' : 'neutral',
        })
      }
    }
    if (g.followUpDate) {
      const d = daysUntil(g.followUpDate)
      if (d != null && d >= 0 && d <= 90) {
        items.push({
          groupId: g.id,
          groupName: g.groupName,
          date: g.followUpDate,
          label: `Follow-up${g.followUpNote ? ` — ${g.followUpNote}` : ''} (${fmt(g.followUpDate)})`,
          tone: d <= 3 ? 'urgent' : 'warn',
        })
      }
    }
    if (g.oeStartDate) {
      const d = daysUntil(g.oeStartDate)
      if (d != null && d >= 0 && d <= 90) {
        items.push({
          groupId: g.id,
          groupName: g.groupName,
          date: g.oeStartDate,
          label: `OE opens (${fmt(g.oeStartDate)})`,
          tone: d <= 14 ? 'warn' : 'accent',
        })
      }
    }
  }

  return items.sort((a, b) => a.date.localeCompare(b.date))
}

const BUCKETS: { label: string; max: number }[] = [
  { label: 'Next 7 days', max: 7 },
  { label: '8 - 30 days', max: 30 },
  { label: '31 - 60 days', max: 60 },
  { label: '61 - 90 days', max: 90 },
]

const toneColors: Record<string, string> = {
  urgent: 'oklch(0.47 0.16 30)',
  warn: 'oklch(0.46 0.11 65)',
  accent: 'oklch(0.44 0.11 255)',
  neutral: 'var(--text-muted)',
}

export default function TimelineCard({ groups }: TimelineCardProps) {
  const router = useRouter()
  const items = collectItems(groups)

  if (items.length === 0) return null

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mt-6">
      <h2 className="font-semibold text-ink mb-4">Upcoming 90 days</h2>
      <div className="grid grid-cols-4 gap-4">
        {BUCKETS.map((bucket, i) => {
          const min = i === 0 ? 0 : BUCKETS[i - 1].max + 1
          const bucket_items = items.filter((item) => {
            const d = daysUntil(item.date)
            return d != null && d >= min && d <= bucket.max
          })

          return (
            <div key={bucket.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">
                {bucket.label}
              </p>
              {bucket_items.length === 0 ? (
                <p className="text-xs text-ink-faint italic">Nothing due</p>
              ) : (
                <div className="space-y-2">
                  {bucket_items.slice(0, 6).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/groups/${item.groupId}`)}
                      className="w-full text-left"
                    >
                      <div className="text-xs font-medium text-ink truncate">{item.groupName}</div>
                      <div
                        className="text-[10px] truncate"
                        style={{ color: toneColors[item.tone] }}
                      >
                        {item.label}
                      </div>
                    </button>
                  ))}
                  {bucket_items.length > 6 && (
                    <p className="text-[10px] text-ink-faint">+{bucket_items.length - 6} more</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'
import Link from 'next/link'
import type { DashboardCounts } from '@/types'

interface MetricStripProps {
  counts: DashboardCounts & { transition: number }
}

export default function MetricStrip({ counts }: MetricStripProps) {
  const metrics = [
    { label: 'Reach out', value: counts.reach, href: '/groups?filter=reachout' },
    { label: 'On OE now', value: counts.oeNow, href: '/groups?filter=oenow' },
    { label: '90 days out', value: counts.oe90, href: '/groups?filter=oe90' },
    { label: 'Follow-ups', value: counts.followUps, href: '/groups?filter=followup' },
    { label: 'Flagged', value: counts.flagged, href: '/groups?filter=priority' },
    { label: 'Total book', value: counts.total, href: '/groups' },
  ]

  return (
    <div className="grid grid-cols-6 gap-4 mb-8">
      {metrics.map((m) => (
        <Link
          key={m.label}
          href={m.href}
          className="bg-canvas-subtle rounded-xl p-4 text-center hover:bg-line/50 transition-colors group"
        >
          <div className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors">
            {m.value}
          </div>
          <div className="text-xs text-ink-faint uppercase tracking-wide mt-1">
            {m.label}
          </div>
        </Link>
      ))}
    </div>
  )
}

'use client'
import { useUIStore } from '@/lib/store'
import type { ListFilter } from '@/types'

const chips: { label: string; value: ListFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reach out', value: 'reachout' },
  { label: 'On OE', value: 'oenow' },
  { label: '90 days out', value: 'oe90' },
  { label: 'In transition', value: 'transition' },
  { label: 'Follow-ups', value: 'followup' },
  { label: 'Flagged', value: 'priority' },
]

export default function FilterChips() {
  const { listFilter, setListFilter } = useUIStore()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.value}
          data-filter={chip.value}
          onClick={() => setListFilter(chip.value)}
          className={[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            listFilter === chip.value
              ? 'bg-accent text-white'
              : 'bg-canvas-subtle text-ink-faint hover:bg-canvas hover:text-ink border border-line',
          ].join(' ')}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}

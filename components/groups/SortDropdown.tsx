'use client'
import { useUIStore } from '@/lib/store'
import type { SortOption } from '@/types'

const options: { label: string; value: SortOption }[] = [
  { label: 'Priority', value: 'priority' },
  { label: 'Name A–Z', value: 'name' },
  { label: 'Renewal date', value: 'renewal' },
  { label: 'Employees', value: 'employees' },
]

export default function SortDropdown() {
  const { sort, setSort } = useUIStore()

  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as SortOption)}
      className="border border-line rounded-lg px-3 py-2 text-sm bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

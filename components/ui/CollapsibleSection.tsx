'use client'
import { useUIStore } from '@/lib/store'

interface CollapsibleSectionProps {
  title: string
  sectionKey: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  sectionKey,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const collapsedSections = useUIStore((s) => s.collapsedSections)
  const toggleSection = useUIStore((s) => s.toggleSection)

  const isCollapsed = sectionKey in collapsedSections
    ? collapsedSections[sectionKey]
    : !defaultOpen

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-ink text-sm">{title}</span>
        <span className="text-ink-faint text-xs select-none">
          {isCollapsed ? '▸' : '▾'}
        </span>
      </button>
      {!isCollapsed && (
        <div className="px-5 pb-5">{children}</div>
      )}
    </div>
  )
}

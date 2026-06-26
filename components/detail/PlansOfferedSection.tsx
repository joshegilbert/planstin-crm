'use client'
import { useState } from 'react'
import type { Group, PlanFamily } from '@/types'
import { usePlanCatalog, catalogToFamilies } from '@/hooks/usePlanCatalog'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface PlansOfferedSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

const CURRENT_YEAR = new Date().getFullYear()

const FAMILY_COLORS: Record<string, { bg: string; text: string }> = {
  'Preventive':           { bg: 'oklch(0.95 0.04 155)', text: 'oklch(0.38 0.10 155)' },
  'Care+':                { bg: 'oklch(0.95 0.03 250)', text: 'oklch(0.42 0.12 255)' },
  'Zion & Virtual Care':  { bg: 'oklch(0.95 0.04 300)', text: 'oklch(0.40 0.11 290)' },
  'Dental':               { bg: 'oklch(0.96 0.05 60)',  text: 'oklch(0.44 0.11 55)'  },
  'Vision':               { bg: 'oklch(0.95 0.035 30)', text: 'oklch(0.45 0.14 28)'  },
  'Supplemental':         { bg: '#f0eee8',              text: '#6f6c66'              },
}

function getPlanColor(families: PlanFamily[], plan: string) {
  const family = families.find((f) => f.plans.includes(plan))
  if (!family) return { bg: '#f0eee8', text: '#6f6c66' }
  return FAMILY_COLORS[family.name] ?? { bg: '#f0eee8', text: '#6f6c66' }
}

export function PlansOfferedSection({ group, onUpdate }: PlansOfferedSectionProps) {
  const offered = group.plansOffered || []
  const [catalogYear, setCatalogYear] = useState(CURRENT_YEAR)
  const [showCatalog, setShowCatalog] = useState(offered.length === 0)

  const { data: catalogItems = [] } = usePlanCatalog(catalogYear)
  const families = catalogToFamilies(catalogItems)

  function togglePlan(plan: string) {
    const next = offered.includes(plan)
      ? offered.filter((p) => p !== plan)
      : [...offered, plan]
    onUpdate({ plansOffered: next })
  }

  return (
    <CollapsibleSection title="Plans offered" sectionKey="plans-offered" defaultOpen={true}>
      {/* Selected plan chips */}
      {offered.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {offered.map((plan) => {
            const color = getPlanColor(families, plan)
            return (
              <button
                key={plan}
                onClick={() => togglePlan(plan)}
                title="Click to remove"
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-75"
                style={{ background: color.bg, color: color.text }}
              >
                {plan}
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M2 2l6 6M8 2l-6 6" strokeLinecap="round" />
                </svg>
              </button>
            )
          })}
        </div>
      )}

      {offered.length === 0 && !showCatalog && (
        <p className="text-sm text-ink-faint mb-3">No plans selected</p>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setShowCatalog((v) => !v)}
        className="text-xs text-accent hover:underline"
      >
        {showCatalog ? '− Hide plan catalog' : '+ Select plans'}
      </button>

      {/* Plan catalog */}
      {showCatalog && (
        <div className="mt-3">
          {/* Year toggle (local display only — not persisted to DB) */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-ink-faint">Plan year</span>
            <div className="flex gap-1">
              {[CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map((y) => (
                <button
                  key={y}
                  onClick={() => setCatalogYear(y)}
                  className="text-xs px-2.5 py-0.5 rounded-md transition-colors"
                  style={
                    catalogYear === y
                      ? { background: 'var(--accent)', color: '#fff' }
                      : { color: 'var(--text-muted)', background: 'transparent' }
                  }
                >
                  {y}
                </button>
              ))}
            </div>
            {offered.length > 0 && (
              <span className="text-xs text-ink-faint ml-auto">
                {offered.length} selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {families.map((family) => (
              <div key={family.name}>
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">
                  {family.name}
                </p>
                <div className="space-y-1.5">
                  {family.plans.map((plan) => {
                    const checked = offered.includes(plan)
                    return (
                      <div
                        key={plan}
                        onClick={() => togglePlan(plan)}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                          style={
                            checked
                              ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
                              : { borderColor: 'var(--border)' }
                          }
                        >
                          {checked && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                              <path d="M1.5 5l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span
                          className="text-sm transition-colors select-none"
                          style={{ color: checked ? 'var(--text)' : 'var(--text-muted)' }}
                        >
                          {plan}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {families.length === 0 && (
            <p className="text-sm text-ink-faint text-center py-4">
              No plans in catalog for {catalogYear}.{' '}
              <a href="/settings" className="text-accent hover:underline">Configure plan catalog</a>
            </p>
          )}
        </div>
      )}
    </CollapsibleSection>
  )
}

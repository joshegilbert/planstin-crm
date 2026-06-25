'use client'
import type { Group } from '@/types'
import { PLAN_FAMILIES } from '@/constants/plan-families'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface PlansOfferedSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

export function PlansOfferedSection({ group, onUpdate }: PlansOfferedSectionProps) {
  const offered = group.plansOffered || []

  function togglePlan(plan: string) {
    const next = offered.includes(plan)
      ? offered.filter((p) => p !== plan)
      : [...offered, plan]
    onUpdate({ plansOffered: next })
  }

  return (
    <CollapsibleSection title="Plans offered" sectionKey="plans-offered" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {PLAN_FAMILIES.map((family) => (
          <div key={family.name}>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">
              {family.name}
            </p>
            <div className="space-y-1.5">
              {family.plans.map((plan) => {
                const checked = offered.includes(plan)
                return (
                  <label
                    key={plan}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                      style={
                        checked
                          ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
                          : { borderColor: 'var(--border)' }
                      }
                      onClick={() => togglePlan(plan)}
                    >
                      {checked && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 10 10"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            d="M1.5 5l2.5 2.5 4.5-4.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlan(plan)}
                      className="sr-only"
                    />
                    <span
                      className="text-sm transition-colors"
                      onClick={() => togglePlan(plan)}
                      style={{ color: checked ? 'var(--text)' : 'var(--text-muted)' }}
                    >
                      {plan}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}

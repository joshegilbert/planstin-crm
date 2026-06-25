'use client'
import type { Group } from '@/types'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface OpenEnrollmentSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

export function OpenEnrollmentSection({ group, onUpdate }: OpenEnrollmentSectionProps) {
  return (
    <CollapsibleSection title="Open enrollment" sectionKey="open-enrollment" defaultOpen={true}>
      <div className="space-y-3">
        {/* OE start date */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">OE start date</label>
          <input
            type="date"
            value={group.oeStartDate || ''}
            onChange={(e) => onUpdate({ oeStartDate: e.target.value || null })}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* OE end date */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">OE end date</label>
          <input
            type="date"
            value={group.oeEndDate || ''}
            onChange={(e) => onUpdate({ oeEndDate: e.target.value || null })}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Approach */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">Approach</label>
          <select
            value={group.oeMode}
            onChange={(e) => onUpdate({ oeMode: e.target.value as Group['oeMode'] })}
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="undecided">Undecided</option>
            <option value="active">Fully active OE</option>
            <option value="passive">Auto-renewal</option>
          </select>
        </div>

        {/* ASA/BSA signed */}
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
            style={
              group.asaSigned
                ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
                : { borderColor: 'var(--border)' }
            }
            onClick={() => onUpdate({ asaSigned: !group.asaSigned })}
          >
            {group.asaSigned && (
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
          <label
            className="text-sm text-ink cursor-pointer select-none"
            onClick={() => onUpdate({ asaSigned: !group.asaSigned })}
          >
            ASA / BSA signed
          </label>
        </div>

        {/* Decision notes */}
        <div>
          <label className="block text-xs text-ink-faint mb-1">OE decision notes</label>
          <textarea
            rows={3}
            value={group.oeDecisionNote}
            onChange={(e) => onUpdate({ oeDecisionNote: e.target.value })}
            placeholder="Notes about OE approach or decisions..."
            className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>
    </CollapsibleSection>
  )
}

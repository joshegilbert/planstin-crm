'use client'
import type { Group } from '@/types'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface GroupDetailsSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

const inputClass =
  'w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30'
const labelClass = 'block text-xs text-ink-faint mb-1'

export function GroupDetailsSection({ group, onUpdate }: GroupDetailsSectionProps) {
  return (
    <CollapsibleSection title="Group details" sectionKey="group-details" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {/* Employees */}
        <div>
          <label className={labelClass}>Employees</label>
          <input
            type="number"
            value={group.employees ?? ''}
            onChange={(e) =>
              onUpdate({ employees: e.target.value ? Number(e.target.value) : null })
            }
            className={inputClass}
            min={0}
          />
        </div>

        {/* State */}
        <div>
          <label className={labelClass}>State</label>
          <input
            type="text"
            value={group.state}
            onChange={(e) => onUpdate({ state: e.target.value })}
            className={inputClass}
            placeholder="e.g. UT"
          />
        </div>

        {/* Platform */}
        <div>
          <label className={labelClass}>Platform</label>
          <select
            value={group.platform}
            onChange={(e) => onUpdate({ platform: e.target.value as Group['platform'] })}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="Employee Navigator">Employee Navigator</option>
            <option value="Planstin Portals / Salesforce">Planstin Portals / Salesforce</option>
            <option value="Both">Both</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Participation */}
        <div>
          <label className={labelClass}>Participation</label>
          <input
            type="text"
            value={group.participation}
            onChange={(e) => onUpdate({ participation: e.target.value })}
            className={inputClass}
            placeholder="e.g. 80%"
          />
        </div>

        {/* Plan richness */}
        <div>
          <label className={labelClass}>Plan richness</label>
          <select
            value={group.planRichness}
            onChange={(e) => onUpdate({ planRichness: e.target.value as Group['planRichness'] })}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="Lean">Lean</option>
            <option value="Standard">Standard</option>
            <option value="Rich">Rich</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Claims fund */}
        <div>
          <label className={labelClass}>Claims fund</label>
          <input
            type="text"
            value={group.claimsFund}
            onChange={(e) => onUpdate({ claimsFund: e.target.value })}
            className={inputClass}
            placeholder="e.g. $500k"
          />
        </div>

        {/* FTE */}
        <div>
          <label className={labelClass}>FTE</label>
          <input
            type="number"
            value={group.fte ?? ''}
            onChange={(e) =>
              onUpdate({ fte: e.target.value ? Number(e.target.value) : null })
            }
            className={inputClass}
            min={0}
          />
        </div>

        {/* Active on plans */}
        <div>
          <label className={labelClass}>Active on plans</label>
          <input
            type="number"
            value={group.activeOnPlans ?? ''}
            onChange={(e) =>
              onUpdate({ activeOnPlans: e.target.value ? Number(e.target.value) : null })
            }
            className={inputClass}
            min={0}
          />
        </div>

        {/* Agent */}
        <div>
          <label className={labelClass}>Agent</label>
          <input
            type="text"
            value={group.agent}
            onChange={(e) => onUpdate({ agent: e.target.value })}
            className={inputClass}
            placeholder="Agent name"
          />
        </div>

        {/* Salesforce link */}
        <div>
          <label className={labelClass}>Salesforce link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={group.salesforceLink}
              onChange={(e) => onUpdate({ salesforceLink: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
            {group.salesforceLink && (
              <a
                href={group.salesforceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline flex-shrink-0"
              >
                Open ↗
              </a>
            )}
          </div>
        </div>

        {/* Contributions - full width */}
        <div className="col-span-2">
          <label className={labelClass}>Contributions</label>
          <input
            type="text"
            value={group.contributions}
            onChange={(e) => onUpdate({ contributions: e.target.value })}
            className={inputClass}
            placeholder="e.g. 75% EE, 50% DEP"
          />
        </div>
      </div>

      {/* Group contact */}
      <div className="mt-5 pt-4 border-t border-line">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3">
          Group contact
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <label className={labelClass}>Contact name</label>
            <input
              type="text"
              value={group.contactName}
              onChange={(e) => onUpdate({ contactName: e.target.value })}
              className={inputClass}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <input
              type="text"
              value={group.gcRole}
              onChange={(e) => onUpdate({ gcRole: e.target.value })}
              className={inputClass}
              placeholder="e.g. HR Manager"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={group.contactEmail}
              onChange={(e) => onUpdate({ contactEmail: e.target.value })}
              className={inputClass}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={group.contactPhone}
              onChange={(e) => onUpdate({ contactPhone: e.target.value })}
              className={inputClass}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      </div>

      {/* NHO */}
      <div className="mt-5 pt-4 border-t border-line">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3">
          New hire orientation
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <label className={labelClass}>NHO status</label>
            <select
              value={group.nhoStatus}
              onChange={(e) => onUpdate({ nhoStatus: e.target.value as Group['nhoStatus'] })}
              className={inputClass}
            >
              <option value="">Not set</option>
              <option value="not-required">Not required</option>
              <option value="tbd">TBD</option>
              <option value="recurring">Recurring</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>NHO note</label>
            <textarea
              value={group.nhoNote}
              onChange={(e) => onUpdate({ nhoNote: e.target.value })}
              rows={2}
              className="w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="NHO details..."
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}

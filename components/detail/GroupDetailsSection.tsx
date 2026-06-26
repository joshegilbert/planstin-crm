'use client'
import { useState } from 'react'
import type { Group } from '@/types'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { ContactsSection } from './ContactsSection'

interface GroupDetailsSectionProps {
  group: Group
  onUpdate: (patch: Partial<Group>) => void
}

const inputClass =
  'w-full text-sm border border-line rounded-lg px-2 py-1.5 bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30'
const labelClass = 'block text-xs text-ink-faint mb-1'

const NHO_LABELS: Record<string, string> = {
  'not-required': 'Not required',
  tbd: 'TBD',
  recurring: 'Recurring',
  scheduled: 'Scheduled',
}

export function GroupDetailsSection({ group, onUpdate }: GroupDetailsSectionProps) {
  const [editing, setEditing] = useState(false)

  const legacyContact =
    group.contactName || group.contactEmail || group.contactPhone
      ? { name: group.contactName, email: group.contactEmail, phone: group.contactPhone, role: group.gcRole }
      : null

  const computedPlanRichness =
    group.employees && group.plansOffered.length > 0
      ? (group.employees / group.plansOffered.length).toFixed(1)
      : null

  // Build summary rows — only show filled fields
  const summaryRows: { label: string; value: string }[] = [
    group.employees != null ? { label: 'Employees', value: group.employees.toLocaleString() } : null,
    group.state ? { label: 'State', value: group.state } : null,
    group.platform ? { label: 'Platform', value: group.platform } : null,
    group.agent ? { label: 'Agent', value: group.agent } : null,
    group.participation ? { label: 'Participation', value: group.participation } : null,
    group.planRichness ? { label: 'Plan richness', value: group.planRichness } : null,
    group.claimsFund ? { label: 'Claims fund', value: group.claimsFund } : null,
    group.contributions ? { label: 'Contributions', value: group.contributions } : null,
    group.fte != null ? { label: 'FTE', value: group.fte.toLocaleString() } : null,
    group.activeOnPlans != null ? { label: 'Active on plans', value: group.activeOnPlans.toLocaleString() } : null,
    group.nhoStatus ? { label: 'NHO', value: NHO_LABELS[group.nhoStatus] ?? group.nhoStatus } : null,
  ].filter((item): item is { label: string; value: string } => item !== null)

  const hasLinks = !!(group.salesforceLink || group.websiteUrl)
  const hasData = summaryRows.length > 0 || hasLinks

  if (!editing) {
    return (
      <CollapsibleSection title="Group details" sectionKey="group-details" defaultOpen={true}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {!hasData ? (
              <p className="text-sm text-ink-faint py-1">No details added yet</p>
            ) : (
              <>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                  {summaryRows.map(({ label, value }) => (
                    <div key={label} className="flex gap-2 min-w-0">
                      <dt className="text-xs text-ink-faint w-24 flex-shrink-0 pt-0.5 leading-5">{label}</dt>
                      <dd className="text-sm text-ink truncate">{value}</dd>
                    </div>
                  ))}
                </dl>
                {hasLinks && (
                  <div className="flex items-center gap-4">
                    {group.salesforceLink && (
                      <a
                        href={group.salesforceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Salesforce ↗
                      </a>
                    )}
                    {group.websiteUrl && (
                      <a
                        href={group.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Company website ↗
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-ink-faint hover:text-accent transition-colors flex-shrink-0"
          >
            {hasData ? 'Edit' : 'Add details'}
          </button>
        </div>

        <ContactsSection groupId={group.id} legacyContact={legacyContact} />
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Group details" sectionKey="group-details" defaultOpen={true}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-ink-faint">Editing group details</span>
        <button
          onClick={() => setEditing(false)}
          className="text-xs font-medium text-accent hover:underline"
        >
          Done
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
          {computedPlanRichness && (
            <p className="text-xs text-ink-faint mt-1">
              Calc: {group.employees} / {group.plansOffered.length} plans ={' '}
              <span className="font-medium text-ink">{computedPlanRichness} members/plan</span>
            </p>
          )}
        </div>

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

        <div>
          <label className={labelClass}>Renewal date</label>
          <input
            type="date"
            value={group.renewalDate || ''}
            onChange={(e) => onUpdate({ renewalDate: e.target.value || null })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Salesforce link</label>
          <input
            type="text"
            value={group.salesforceLink}
            onChange={(e) => onUpdate({ salesforceLink: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Company website</label>
          <input
            type="url"
            value={group.websiteUrl}
            onChange={(e) => onUpdate({ websiteUrl: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

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

      {/* Contacts */}
      <ContactsSection groupId={group.id} />

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

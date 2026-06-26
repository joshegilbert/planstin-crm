'use client'
import { useRouter } from 'next/navigation'
import type { Group } from '@/types'
import { useGroup } from '@/hooks/useGroup'
import { useGroupContacts } from '@/hooks/useGroupContacts'
import { useReminders } from '@/hooks/useReminders'
import { useClaimLog } from '@/hooks/useClaimLog'
import { buildVM, statusInfo } from '@/lib/scoring'
import { fmt, daysUntil } from '@/lib/dates'

interface MeetingPrepViewProps {
  id: string
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3 pb-1 border-b border-line">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-4 py-1">
      <span className="text-xs text-ink-faint w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-ink flex-1">{value}</span>
    </div>
  )
}

export function MeetingPrepView({ id }: MeetingPrepViewProps) {
  const router = useRouter()
  const { data: group, isLoading, isError } = useGroup(id)
  const { data: contacts = [] } = useGroupContacts(id)
  const { data: reminders = [] } = useReminders(id)
  const { data: claimLog = [] } = useClaimLog(id)

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-ink-faint text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (isError || !group) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <p className="text-ink-faint text-sm">Could not load group.</p>
        <button onClick={() => router.push('/groups')} className="text-sm text-accent hover:underline">
          Back to groups
        </button>
      </div>
    )
  }

  const vm = buildVM(group)
  const si = statusInfo(group.status)
  const recentNotes = (group.notes || [])
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
  const openWorkflowTasks = (group.workflows || []).flatMap((wf) =>
    wf.sections.flatMap((sec) =>
      sec.tasks.filter((t) => !t.completedDate).map((t) => ({ ...t, workflowTitle: wf.title })),
    ),
  )
  const activeReminders = reminders.filter((r) => !r.completed)
  const recentClaims = claimLog.slice(0, 3)

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="max-w-[800px] mx-auto px-8 py-6">
        {/* Nav */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push(`/groups/${id}`)}
            className="text-sm text-ink-faint hover:text-ink transition-colors"
          >
            Back to group
          </button>
          <span className="text-ink-faint">/</span>
          <span className="text-sm text-ink">Meeting prep</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink mb-1">{group.groupName}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium" style={{ color: si.color }}>{si.label}</span>
            {group.renewalDate && (
              <span className="text-sm text-ink-faint">
                Renews {fmt(group.renewalDate)}
                {vm.renewalSub ? ` (${vm.renewalSub})` : ''}
              </span>
            )}
            {group.employees && (
              <span className="text-sm text-ink-faint">{group.employees} employees</span>
            )}
          </div>
          {vm.score > 0 && vm.actionDetail && (
            <div className="mt-2 text-sm text-ink bg-canvas-subtle rounded-lg px-3 py-2 border border-line">
              {vm.actionDetail}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            {/* Contacts */}
            <Section title="Contacts">
              {contacts.length > 0 ? (
                contacts.map((c) => (
                  <div key={c.id} className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{c.name}</span>
                      {c.isPrimary && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-line text-ink-faint">
                          Primary
                        </span>
                      )}
                    </div>
                    {c.role && <p className="text-xs text-ink-faint">{c.role}</p>}
                    {c.email && <a href={`mailto:${c.email}`} className="text-xs text-accent hover:underline block">{c.email}</a>}
                    {c.phone && <p className="text-xs text-ink-faint">{c.phone}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink">
                  {group.contactName || 'No contact on file'}
                  {group.gcRole && <span className="text-ink-faint"> — {group.gcRole}</span>}
                </p>
              )}
            </Section>

            {/* Group overview */}
            <Section title="Group overview">
              <Row label="Status" value={si.label} />
              <Row label="Platform" value={group.platform} />
              <Row label="Employees" value={group.employees?.toString()} />
              <Row label="Active on plans" value={group.activeOnPlans?.toString()} />
              <Row label="Participation" value={group.participation} />
              <Row label="Contributions" value={group.contributions} />
              <Row label="Plans offered" value={group.plansOffered.length > 0 ? group.plansOffered.join(', ') : null} />
              {group.websiteUrl && (
                <Row label="Website" value={
                  <a href={group.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {group.websiteUrl}
                  </a>
                } />
              )}
            </Section>

            {/* Key dates */}
            <Section title="Key dates">
              <Row label="Renewal date" value={fmt(group.renewalDate)} />
              <Row label="Full ownership" value={fmt(group.fullOwnership)} />
              <Row label="Commission effective" value={fmt(group.commissionEffective)} />
              {group.oeStartDate && (
                <Row
                  label="Open enrollment"
                  value={fmt(group.oeStartDate) + (group.oeEndDate ? ` – ${fmt(group.oeEndDate)}` : '')}
                />
              )}
            </Section>

            {/* Claim utilization */}
            {recentClaims.length > 0 && (
              <Section title="Claim utilization (recent)">
                {recentClaims.map((entry) => {
                  const util = entry.claimsFund > 0
                    ? ((entry.claimsPaid / entry.claimsFund) * 100).toFixed(1) + '%'
                    : '—'
                  return (
                    <div key={entry.id} className="flex items-center justify-between py-1 text-sm">
                      <span className="text-ink-faint">{fmt(entry.logDate)}</span>
                      <span className="text-ink">{util}</span>
                    </div>
                  )
                })}
              </Section>
            )}
          </div>

          <div>
            {/* Active reminders */}
            {activeReminders.length > 0 && (
              <Section title="Active reminders">
                {activeReminders.map((r) => {
                  const d = daysUntil(r.triggerDate)
                  return (
                    <div key={r.id} className="flex items-start gap-2 py-1">
                      <span className="text-xs text-ink-faint w-24 flex-shrink-0">
                        {fmt(r.triggerDate)}
                      </span>
                      <span className="text-sm text-ink">{r.note || 'Reminder'}</span>
                      {d != null && d < 0 && (
                        <span className="text-xs ml-auto text-[oklch(0.47_0.16_30)] flex-shrink-0">
                          Overdue
                        </span>
                      )}
                    </div>
                  )
                })}
              </Section>
            )}

            {/* Open workflow tasks */}
            {openWorkflowTasks.length > 0 && (
              <Section title={`Open workflow tasks (${openWorkflowTasks.length})`}>
                {openWorkflowTasks.slice(0, 8).map((t) => (
                  <div key={t.id} className="flex items-start gap-2 py-1">
                    <span className="text-xs text-ink-faint w-24 flex-shrink-0 truncate">
                      {t.dueDate ? fmt(t.dueDate) : 'No date'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{t.label}</p>
                      <p className="text-xs text-ink-faint truncate">{t.workflowTitle}</p>
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Recent notes */}
            <Section title="Recent notes">
              {recentNotes.length === 0 ? (
                <p className="text-sm text-ink-faint italic">No notes yet.</p>
              ) : (
                recentNotes.map((note) => (
                  <div key={note.id} className="mb-3 pb-3 border-b border-line last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-ink-faint">{note.type}</span>
                      <span className="text-xs text-ink-faint">{fmt(note.date)}</span>
                    </div>
                    <p className="text-sm text-ink whitespace-pre-line leading-relaxed">
                      {note.text.slice(0, 300)}{note.text.length > 300 ? '...' : ''}
                    </p>
                  </div>
                ))
              )}
            </Section>

            {/* Watch-outs */}
            {group.watchOuts && (
              <Section title="Watch-outs">
                <p className="text-sm text-ink whitespace-pre-line">{group.watchOuts}</p>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

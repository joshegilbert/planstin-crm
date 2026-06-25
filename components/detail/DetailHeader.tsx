'use client'
import type { Group, GroupViewModel } from '@/types'
import { fmt, isoPlus, todayISO } from '@/lib/dates'
import { statusInfo } from '@/lib/scoring'

const STATUS_OPTIONS = [
  'transition',
  'onboarding',
  'active',
  'open-enrollment',
  'renewal',
  'at-risk',
  'parked',
] as const

const TONE_STYLES: Record<string, { background: string; color: string }> = {
  urgent: { background: 'oklch(0.95 0.035 30)', color: 'oklch(0.47 0.16 30)' },
  warn: { background: 'oklch(0.96 0.05 80)', color: 'oklch(0.46 0.11 65)' },
  accent: { background: 'oklch(0.95 0.03 250)', color: 'oklch(0.44 0.11 255)' },
  good: { background: 'oklch(0.95 0.04 155)', color: 'oklch(0.40 0.09 155)' },
  neutral: { background: '#f0eee8', color: '#6f6c66' },
}

interface DetailHeaderProps {
  group: Group
  vm: GroupViewModel
  onUpdate: (patch: Partial<Group>) => void
}

export function DetailHeader({ group, vm, onUpdate }: DetailHeaderProps) {
  const si = statusInfo(group.status)

  const renewalYear = group.renewalDate
    ? new Date(group.renewalDate + 'T00:00:00').getFullYear()
    : null

  const renewalSubColor =
    vm.renewalDays == null
      ? '#6f6c66'
      : vm.renewalDays < 0
      ? 'oklch(0.47 0.16 30)'
      : vm.renewalDays <= 30
      ? 'oklch(0.46 0.11 65)'
      : 'oklch(0.42 0.09 155)'

  const toneStyle = TONE_STYLES[vm.dueTone] || TONE_STYLES.neutral

  return (
    <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-ink truncate mb-1">
            {group.groupName}
          </h1>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <select
              value={group.status}
              onChange={(e) => onUpdate({ status: e.target.value as Group['status'] })}
              className="text-sm font-medium rounded-lg px-2 py-0.5 border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              style={{ color: si.color }}
            >
              {STATUS_OPTIONS.map((s) => {
                const info = statusInfo(s)
                return (
                  <option key={s} value={s}>
                    {info.label}
                  </option>
                )
              })}
            </select>
            {group.currentBM && (
              <span className="text-sm text-ink-faint">from {group.currentBM}</span>
            )}
          </div>
          {(group.renewalMonth || group.renewalDate) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-faint">
                Renews {group.renewalMonth}
                {renewalYear ? ` ${renewalYear}` : ''}
              </span>
              {vm.renewalSub && (
                <span className="text-xs font-medium" style={{ color: renewalSubColor }}>
                  ({vm.renewalSub})
                </span>
              )}
            </div>
          )}

          {/* Action detail */}
          {vm.score > 0 && vm.actionDetail && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-ink">{vm.actionDetail}</span>
              {vm.dueText && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={toneStyle}
                >
                  {vm.dueText}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Priority star */}
          <button
            onClick={() => onUpdate({ priority: !group.priority })}
            title={group.priority ? 'Remove priority flag' : 'Flag as priority'}
            className="text-xl hover:scale-110 transition-transform"
          >
            {group.priority ? '⭐' : '☆'}
          </button>

          {/* Snooze / unsnooze */}
          {group.snoozedUntil && vm.snoozed ? (
            <div className="flex items-center gap-1 text-xs text-ink-faint bg-canvas-subtle rounded-lg px-2 py-1 border border-line">
              <span>💤 Snoozed until {fmt(group.snoozedUntil)}</span>
              <button
                onClick={() => onUpdate({ snoozedUntil: null })}
                className="ml-1 hover:text-ink"
                title="Unsnooze"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={() => onUpdate({ snoozedUntil: isoPlus(todayISO(), 7) })}
              title="Snooze for 7 days"
              className="text-sm text-ink-faint hover:text-ink px-2 py-1 rounded-lg border border-line hover:border-ink-faint transition-colors"
            >
              💤 7d
            </button>
          )}

          {/* Salesforce link */}
          {group.salesforceLink && (
            <a
              href={group.salesforceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1 rounded-lg border border-line text-ink-faint hover:text-ink hover:border-ink-faint transition-colors"
            >
              Open in SF ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

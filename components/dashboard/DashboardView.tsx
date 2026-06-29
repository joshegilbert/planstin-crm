'use client'
import { useGroups } from '@/hooks/useGroups'
import { useReminders } from '@/hooks/useReminders'
import { buildVM } from '@/lib/scoring'
import MetricStrip from './MetricStrip'
import ReachOutQueue from './ReachOutQueue'
import OeCard from './OeCard'
import SnoozedSection from './SnoozedSection'
import RemindersWidget from './RemindersWidget'
import TodayPanel from './TodayPanel'
import { fmt, todayISO } from '@/lib/dates'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardView() {
  const { data: rawGroups = [], isLoading } = useGroups()
  const { data: reminders = [] } = useReminders()

  const vms = rawGroups.map(buildVM)

  const reachOut = vms
    .filter((g) => g.score > 0 && !g.snoozed)
    .sort((a, b) => b.score - a.score)

  const oeNow = vms.filter((g) => g.oeWindow === 'now')
  const oe90 = vms.filter((g) => g.oeWindow === 'soon')
  const snoozed = vms.filter((g) => g.snoozed)

  const counts = {
    reach: reachOut.length,
    oeNow: oeNow.length,
    oe90: oe90.length,
    followUps: vms.filter((g) => g.followUpDue).length,
    flagged: vms.filter((g) => g.priority).length,
    total: vms.length,
    transition: vms.filter((g) => g.status === 'transition').length,
  }

  return (
    <div className="px-8 py-6 max-w-[1400px]">
      <p className="text-sm text-ink-faint mb-6">
        {getGreeting()} — {fmt(todayISO())}. Here is your book of business.
      </p>

      <MetricStrip counts={counts} />

      {!isLoading && <TodayPanel vms={vms} reminders={reminders} />}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-ink-faint text-sm">
          Loading...
        </div>
      ) : (
        <>
          <div className="flex gap-8">
            {/* Left: reach-out queue */}
            <div className="flex-1 min-w-0">
              <ReachOutQueue groups={reachOut} loading={isLoading} />
            </div>

            {/* Right: cards */}
            <div className="w-80 flex-shrink-0 space-y-4">
              <RemindersWidget />
              <OeCard nowGroups={oeNow} soonGroups={oe90} />
            </div>
          </div>

          <SnoozedSection groups={snoozed} />
        </>
      )}
    </div>
  )
}

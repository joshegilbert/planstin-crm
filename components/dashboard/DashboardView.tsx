'use client'
import { useGroups } from '@/hooks/useGroups'
import { buildVM } from '@/lib/scoring'
import MetricStrip from './MetricStrip'
import ReachOutQueue from './ReachOutQueue'
import OeNowCard from './OeNowCard'
import Oe90Card from './Oe90Card'
import FollowUpsCard from './FollowUpsCard'
import SnoozedSection from './SnoozedSection'

export default function DashboardView() {
  const { data: rawGroups = [], isLoading } = useGroups()

  const vms = rawGroups.map(buildVM)

  const reachOut = vms
    .filter((g) => g.score > 0 && !g.snoozed)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)

  const oeNow = vms.filter((g) => g.oeWindow === 'now')
  const oe90 = vms.filter((g) => g.oeWindow === 'soon')
  const followUps = vms.filter((g) => g.followUpDue)
  const snoozed = vms.filter((g) => g.snoozed)

  const counts = {
    reach: reachOut.length,
    oeNow: oeNow.length,
    oe90: oe90.length,
    followUps: followUps.length,
    flagged: vms.filter((g) => g.priority).length,
    total: vms.length,
    transition: vms.filter((g) => g.status === 'transition').length,
  }

  return (
    <div className="px-8 py-6 max-w-[1400px]">
      <p className="text-sm text-ink-faint italic mb-6">
        Good morning — here&apos;s your book of business.
      </p>

      <MetricStrip counts={counts} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-ink-faint text-sm">
          Loading…
        </div>
      ) : (
        <>
          <div className="flex gap-8">
            {/* Left: reach-out queue (2/3) */}
            <div className="flex-1 min-w-0">
              <ReachOutQueue groups={reachOut} loading={isLoading} />
            </div>

            {/* Right: cards (1/3) */}
            <div className="w-80 flex-shrink-0 space-y-4">
              <OeNowCard groups={oeNow} />
              <Oe90Card groups={oe90} />
              <FollowUpsCard groups={followUps} />
            </div>
          </div>

          <SnoozedSection groups={snoozed} />
        </>
      )}
    </div>
  )
}

import type { Group, GroupViewModel, ReachOutReason, OeWindow } from '@/types'
import { daysUntil, fmt, isoMinus } from './dates'

export function oeWindow(g: Group): OeWindow {
  const oeAnchor = g.oeStartDate || g.renewalDate
  const oeDays = daysUntil(oeAnchor)
  const oeEndDays = daysUntil(g.oeEndDate)
  if (oeDays == null) return 'none'
  if (oeEndDays != null && oeEndDays < 0) return 'passed'
  if (oeDays < 0) return oeEndDays != null && oeEndDays >= 0 ? 'now' : 'passed'
  if (oeDays <= 45) return 'now'
  if (oeDays <= 90) return 'soon'
  return 'future'
}

function transitionStep(g: Group): string {
  if (g.changeCompleted) return 'Complete'
  if (!g.warmHandoff) return 'Awaiting hand-off'
  if (!g.newContact) return 'Make welcome call'
  if (!g.ownershipTaken) return 'Take ownership'
  if (!g.sfUpdated) return 'Update Salesforce'
  return 'Mark complete'
}

export function buildVM(g: Group): GroupViewModel {
  const rd = daysUntil(g.renewalDate)
  const renewalSub =
    rd == null ? '' : rd < 0 ? Math.abs(rd) + 'd ago' : rd === 0 ? 'today' : 'in ' + rd + 'd'

  const inTransition = g.status === 'transition'

  let wfTotalAll = 0
  let wfDoneAll = 0
  const wfCount = (g.workflows || []).length
  ;(g.workflows || []).forEach((w) =>
    (w.sections || []).forEach((sec) =>
      (sec.tasks || []).forEach((t) => {
        wfTotalAll++
        if (t.completedDate) wfDoneAll++
      }),
    ),
  )
  const wfPct = wfTotalAll ? Math.round((wfDoneAll / wfTotalAll) * 100) : 0
  const hasTransitionWf = (g.workflows || []).some((w) => w.type === 'transition')
  const hasRenewalWf = (g.workflows || []).some((w) => w.type === 'renewal')
  const transitionStartSuggest = inTransition && !hasTransitionWf
  const renewalStartSuggest = !hasRenewalWf && rd != null && rd >= 0 && rd <= 90

  const ci = daysUntil(g.nextCheckIn)
  const checkInDue = ci != null && ci < 0
  const checkInText = g.nextCheckIn ? fmt(g.nextCheckIn) : '—'

  const fu = daysUntil(g.followUpDate)
  const followUpDue = fu != null && fu <= 0
  const followUpText = g.followUpDate
    ? fu! < 0
      ? Math.abs(fu!) + 'd ago'
      : fu === 0
        ? 'Today'
        : fmt(g.followUpDate)
    : ''

  let cadenceLabel = 'Not set'
  if (g.cadence === 'monthly') cadenceLabel = 'Monthly'
  else if (g.cadence === 'quarterly') cadenceLabel = 'Quarterly'
  else if (g.cadence === 'custom') cadenceLabel = g.customCadenceDays ? 'Every ' + g.customCadenceDays + 'd' : 'Custom'

  let wfOverdue = 0
  let wfDueSoon = 0
  let nextWfTaskLabel: string | null = null
  ;(g.workflows || []).forEach((w) =>
    (w.sections || []).forEach((sec) =>
      (sec.tasks || []).forEach((t) => {
        if (t.completedDate) return
        const du = daysUntil(t.dueDate)
        if (du == null) return
        if (du < 0) wfOverdue++
        else if (du <= 7) wfDueSoon++
        if (!nextWfTaskLabel) nextWfTaskLabel = t.label
      }),
    ),
  )

  const monitorDue =
    !!g.monitorMonthly && (g.lastMonitor == null || (daysUntil(g.lastMonitor) ?? 0) <= -30)

  let score = 0
  const reasons: ReachOutReason[] = []

  if (followUpDue) {
    score += 130
    reasons.push({ label: fu! < 0 ? 'Follow-up overdue' : 'Follow-up due', tone: 'urgent' })
  }
  if (checkInDue) {
    score += 75
    reasons.push({ label: 'Check-in overdue', tone: 'urgent' })
  }
  if (rd != null && rd < 0) {
    score += 95
    reasons.push({ label: 'Renewal passed', tone: 'urgent' })
  } else if (rd != null && rd <= 90) {
    score += rd <= 30 ? 85 : 50
    reasons.push({ label: rd <= 0 ? 'Renews now' : 'Renews in ' + rd + 'd', tone: rd <= 30 ? 'urgent' : 'warn' })
  }
  if (inTransition) {
    score += 40
    reasons.push({ label: 'In transition', tone: 'accent' })
  }
  if (transitionStartSuggest) {
    score += 25
    reasons.push({ label: 'Set up transition workflow', tone: 'accent' })
  }
  if (g.priority) {
    score += 110
    reasons.push({ label: 'Flagged', tone: 'warn' })
  }
  if (monitorDue) {
    score += 70
    reasons.push({ label: 'Monthly monitor', tone: 'warn' })
  }
  if (wfOverdue > 0) {
    score += 90
    reasons.push({ label: wfOverdue + ' task' + (wfOverdue > 1 ? 's' : '') + ' overdue', tone: 'urgent' })
  } else if (wfDueSoon > 0) {
    score += 45
    reasons.push({ label: wfDueSoon + ' task' + (wfDueSoon > 1 ? 's' : '') + ' due', tone: 'warn' })
  }
  if (renewalStartSuggest) {
    score += 55
    reasons.push({ label: 'Start renewal workflow', tone: 'accent' })
  }
  if (g.employees) score += Number(g.employees) * 0.4

  const snz = daysUntil(g.snoozedUntil)
  const snoozed = snz != null && snz > 0

  const win = oeWindow(g)
  const oeDateText = g.oeStartDate
    ? fmt(g.oeStartDate) + (g.oeEndDate ? ' – ' + fmt(g.oeEndDate) : '')
    : 'Dates not set'

  let actionDetail = ''
  let dueText = ''
  let dueTone: 'urgent' | 'warn' | 'accent' | 'neutral' = 'neutral'

  if (followUpDue) {
    actionDetail = g.followUpNote ? 'Follow up — ' + g.followUpNote : 'Follow-up reminder is due'
    dueText = fu! < 0 ? 'Overdue ' + Math.abs(fu!) + 'd' : 'Due today'
    dueTone = 'urgent'
  } else if (checkInDue) {
    actionDetail = 'Check-in overdue — time to reach back out'
    dueText = 'Overdue ' + Math.abs(ci!) + 'd'
    dueTone = 'urgent'
  } else if (monitorDue) {
    actionDetail = 'Monthly eligibility monitor due — confirm enrolled count'
    dueText = 'Monitor'
    dueTone = 'warn'
  } else if (wfOverdue > 0) {
    actionDetail = 'Workflow task overdue — ' + (nextWfTaskLabel ?? 'see tasks')
    dueText = wfOverdue + ' overdue'
    dueTone = 'urgent'
  } else if (renewalStartSuggest) {
    actionDetail = 'Renewal window open — start the renewal workflow'
    dueText = 'Renews in ' + rd + 'd'
    dueTone = 'warn'
  } else if (wfDueSoon > 0) {
    actionDetail = 'Workflow task coming due — ' + (nextWfTaskLabel ?? 'see tasks')
    dueText = 'Task due'
    dueTone = 'warn'
  } else if (rd != null && rd < 0) {
    actionDetail = 'Plan date has passed — confirm the renewal'
    dueText = Math.abs(rd) + 'd ago'
    dueTone = 'urgent'
  } else if (win === 'now') {
    actionDetail = 'Open enrollment is open — help finalize elections'
    dueText = rd != null ? 'OE in ' + rd + 'd' : 'OE active'
    dueTone = 'warn'
  } else if (inTransition) {
    actionDetail = hasTransitionWf
      ? 'Continue the transition workflow'
      : 'Set up the transition — attach the workflow'
    dueText = g.transitionTimeline ? 'Window ' + g.transitionTimeline : 'In transition'
    dueTone = 'accent'
  } else if (g.priority) {
    actionDetail = 'Flagged for attention'
    dueText = 'Flagged'
    dueTone = 'warn'
  } else {
    actionDetail = 'Review account'
    dueText = ''
    dueTone = 'neutral'
  }

  return {
    ...g,
    score,
    reasons,
    oeWindow: win,
    oeDateText,
    wfDoneAll,
    wfTotalAll,
    wfPct,
    wfCount,
    snoozed,
    renewalDays: rd,
    renewalSub,
    transitionStep: transitionStep(g),
    checkInDue,
    checkInText,
    followUpDue,
    followUpText,
    monitorDue,
    actionDetail,
    dueText,
    dueTone,
    cadenceLabel,
    hasTransitionWf,
    hasRenewalWf,
    renewalStartSuggest,
  }
}

export function statusInfo(s: string): { label: string; color: string } {
  const m: Record<string, { label: string; color: string }> = {
    transition: { label: 'In transition', color: 'oklch(0.46 0.11 255)' },
    active: { label: 'Active client', color: 'oklch(0.42 0.09 155)' },
    onboarding: { label: 'Onboarding', color: 'oklch(0.5 0.12 200)' },
    'open-enrollment': { label: 'Open enrollment', color: 'oklch(0.55 0.13 65)' },
    renewal: { label: 'Renewal', color: 'oklch(0.58 0.13 75)' },
    'at-risk': { label: 'At risk', color: 'oklch(0.52 0.17 28)' },
    parked: { label: 'Parked', color: '#8a877f' },
  }
  return m[s] || m.active
}

export { isoMinus }

import { describe, it, expect } from 'vitest'
import { oeWindow, buildVM } from './scoring'
import { isoPlus, todayISO } from './dates'
import type { Group } from '@/types'

function makeGroup(overrides: Partial<Group> = {}): Group {
  return {
    id: 'g_test',
    groupName: 'Test Group',
    currentBM: '',
    state: '',
    agent: '',
    platform: '',
    salesforceLink: '',
    websiteUrl: '',
    renewalMonth: '',
    renewalDate: null,
    status: 'active',
    priority: false,
    startDate: null,
    fullOwnership: null,
    commissionEffective: null,
    transitionTimeline: '',
    handoffWindowStart: null,
    handoffWindowEnd: null,
    warmHandoff: false,
    warmHandoffDate: null,
    newContact: false,
    ownershipTaken: false,
    sfUpdated: false,
    changeCompleted: false,
    introEmailDate: null,
    employees: null,
    activeOnPlans: null,
    fte: null,
    planRichness: '',
    claimsFund: '',
    contributions: '',
    participation: '',
    plans: '',
    plansOffered: [],
    planYear: null,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    gcRole: '',
    cadence: '',
    customCadenceDays: null,
    lastCheckIn: null,
    nextCheckIn: null,
    followUpDate: null,
    followUpNote: '',
    oeMode: 'undecided',
    oeStartDate: null,
    oeEndDate: null,
    asaSigned: false,
    oeDecisionNote: '',
    nhoStatus: '',
    nhoNote: '',
    watchOuts: '',
    monitorMonthly: false,
    lastMonitor: null,
    snoozedUntil: null,
    ...overrides,
  }
}

describe('oeWindow', () => {
  it('classifies an undecided group with a renewal 30 days out as "now" via the renewal-date fallback', () => {
    const g = makeGroup({ renewalDate: isoPlus(todayISO(), 30) })
    expect(oeWindow(g)).toBe('now')
  })

  it('classifies an undecided group with a renewal 60 days out as "soon"', () => {
    const g = makeGroup({ renewalDate: isoPlus(todayISO(), 60) })
    expect(oeWindow(g)).toBe('soon')
  })

  it('classifies an undecided group with a renewal 120 days out as "future"', () => {
    const g = makeGroup({ renewalDate: isoPlus(todayISO(), 120) })
    expect(oeWindow(g)).toBe('future')
  })

  it('classifies a group with no renewal date and no OE start date as "none"', () => {
    const g = makeGroup({ renewalDate: null, oeStartDate: null })
    expect(oeWindow(g)).toBe('none')
  })

  it('prefers an explicit oeStartDate over the renewal-date fallback', () => {
    const g = makeGroup({
      oeStartDate: isoPlus(todayISO(), 30),
      oeEndDate: isoPlus(todayISO(), 200),
      renewalDate: isoPlus(todayISO(), 300),
    })
    expect(oeWindow(g)).toBe('now')
  })

  it('classifies a group whose OE window has fully passed as "passed"', () => {
    const g = makeGroup({
      oeStartDate: isoPlus(todayISO(), -30),
      oeEndDate: isoPlus(todayISO(), -5),
    })
    expect(oeWindow(g)).toBe('passed')
  })
})

describe('buildVM', () => {
  it('wires oeWindow into the view model and flags "Dates not set" when oeStartDate is absent', () => {
    const g = makeGroup({ renewalDate: isoPlus(todayISO(), 30) })
    const vm = buildVM(g)
    expect(vm.oeWindow).toBe('now')
    expect(vm.oeDateText).toBe('Dates not set')
  })
})

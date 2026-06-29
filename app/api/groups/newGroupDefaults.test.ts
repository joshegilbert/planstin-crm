// These tests cover buildNewGroupRow's defaulting decisions (the exact bug class that made a
// freshly-created "TEST" group surface as "on open enrollment now" — see lib/scoring.test.ts
// for that classification logic). They do NOT touch Supabase or route.ts's insert call, so
// they can't catch a column-name typo against the live schema — that class of bug is covered
// by manually creating a group through the UI and checking it lands correctly.
import { describe, it, expect } from 'vitest'
import { buildNewGroupRow } from './newGroupDefaults'

describe('buildNewGroupRow', () => {
  it('defaults a minimal active-status submission the way AddGroupModal sends it', () => {
    const row = buildNewGroupRow({ groupName: 'Acme Corp', status: 'active', renewalDate: '2026-09-01' })
    expect(row.oe_mode).toBe('undecided')
    expect(row.cadence).toBe('quarterly')
    expect(row.status).toBe('active')
    expect(row.renewal_month).toBe('Sep')
    expect(row.warm_handoff).toBe(true)
    expect(row.change_completed).toBe(true)
    expect(row.priority).toBe(false)
    expect(row.current_bm).toBe('You')
  })

  it('defaults a transition-status submission with the opposite handoff-flag polarity', () => {
    const row = buildNewGroupRow({ groupName: 'Beta LLC', status: 'transition' })
    expect(row.warm_handoff).toBe(false)
    expect(row.change_completed).toBe(false)
    expect(row.current_bm).toBe('—')
  })

  it('falls back renewal_month to empty string and renewal_date to null with no renewalDate given', () => {
    const row = buildNewGroupRow({ groupName: 'Gamma Inc', status: 'active' })
    expect(row.renewal_month).toBe('')
    expect(row.renewal_date).toBeNull()
  })

  it('always defaults oe_mode to undecided regardless of other fields — the root cause behind the TEST-group surprise', () => {
    const row = buildNewGroupRow({ groupName: 'Delta Co', status: 'active', renewalDate: '2026-07-15' })
    expect(row.oe_mode).toBe('undecided')
  })
})

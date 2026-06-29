// One-time backfill: populate handoff_window_start/end (and default-fill full_ownership /
// commission_effective when empty) for existing transition groups whose only record of the
// handoff window is the freeform transition_timeline text.
//
// Run once with: node --env-file=.env.local scripts/backfill-handoff-windows.mjs
// Safe to re-run — only touches rows where handoff_window_start is still null, and never
// overwrites an already-set full_ownership/commission_effective.
// Delete this file once you've confirmed it's no longer needed (Phase D).

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in the environment.')
  process.exit(1)
}
const supabase = createClient(url, key, { auth: { persistSession: false } })

// Mirrors lib/dates.ts's parseTransitionWindow() / firstOfNextMonth() — duplicated here
// (rather than imported) so this throwaway script can run under plain `node`, no TS runtime.
function buildISO(yr, mo, da) {
  return yr + '-' + String(mo).padStart(2, '0') + '-' + String(da).padStart(2, '0')
}

function parseTransitionWindow(str) {
  if (!str || !str.trim()) return { start: null, end: null }
  const parts = str.split(/\s*[-–—]\s*/).map((p) => p.trim()).filter(Boolean)
  if (parts.length === 0 || parts.length > 2) return { start: null, end: null }
  const rawStart = parts[0]
  const rawEnd = parts.length === 2 ? parts[1] : parts[0]
  const tokenRe = /^(\d{1,2})\/(\d{1,2})$/
  const ms = rawStart.match(tokenRe)
  const me = rawEnd.match(tokenRe)
  if (!ms || !me) return { start: null, end: null }
  const yr = new Date().getFullYear()
  const start = buildISO(yr, Number(ms[1]), Number(ms[2]))
  let end = buildISO(yr, Number(me[1]), Number(me[2]))
  if (end < start) end = buildISO(yr + 1, Number(me[1]), Number(me[2]))
  return { start, end }
}

function firstOfNextMonth(iso) {
  const [y, m] = iso.split('-').map(Number)
  let yr = y
  let mo = m + 1
  if (mo > 12) {
    mo -= 12
    yr += 1
  }
  return buildISO(yr, mo, 1)
}

async function main() {
  const { data: groups, error } = await supabase
    .from('groups')
    .select('id, group_name, transition_timeline, status, handoff_window_start, full_ownership, commission_effective')
    .eq('status', 'transition')
    .is('handoff_window_start', null)
    .not('transition_timeline', 'is', null)

  if (error) {
    console.error('Failed to fetch groups:', error.message)
    process.exit(1)
  }

  const results = []
  for (const g of groups ?? []) {
    if (!g.transition_timeline?.trim()) continue
    const { start, end } = parseTransitionWindow(g.transition_timeline)
    if (!start || !end) {
      results.push({ group: g.group_name, timeline: g.transition_timeline, status: 'UNPARSEABLE' })
      continue
    }

    const patch = { handoff_window_start: start, handoff_window_end: end }
    if (!g.full_ownership) patch.full_ownership = firstOfNextMonth(start)
    if (!g.commission_effective) patch.commission_effective = firstOfNextMonth(start)

    const { error: updateError } = await supabase.from('groups').update(patch).eq('id', g.id)
    results.push({
      group: g.group_name,
      timeline: g.transition_timeline,
      status: updateError ? `ERROR: ${updateError.message}` : 'OK',
      ...patch,
    })
  }

  console.table(results)
  console.log(`\n${results.length} groups processed.`)
}

main()

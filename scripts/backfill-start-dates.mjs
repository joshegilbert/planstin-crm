// One-time backfill: populate start_date for groups using the "Group Plan Date" column from
// the Hand-Off Timeline sheet. Matches strictly by exact group_name — no fuzzy matching — and
// never overwrites an already-set start_date.
//
// Run once with: node --env-file=.env.local scripts/backfill-start-dates.mjs
// Delete this file once you've confirmed it's no longer needed (Phase D).

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in the environment.')
  process.exit(1)
}
const supabase = createClient(url, key, { auth: { persistSession: false } })

// Group Plan Date column from the uploaded Hand-Off Timeline sheet.
const SHEET_START_DATES = {
  'Off-Road Innovations Inc': '2020-10-01',
  'My Logistics Partner': '2021-10-01',
  'Cannon Concrete Pumps': '2022-12-01',
  'Jared E. Holland PLLC': '2022-12-01',
  "Branson's Resort": '2025-09-01',
  'Dr. Monzer Shakally, DDS LLC': '2025-09-01',
  'Benjamin R Anderson sole proprietorship': '2025-12-01',
  'Tina Forthun Edwards MD Inc': '2025-12-01',
  'Brocious & Brocious Insurance Services': '2020-10-01',
  'Rocky Mountain Fence, Inc': '2020-10-01',
  'SO CONSTRUCTION INC': '2021-10-01',
  'Jenna M Meyerstein': '2021-12-01',
  'King Chiropractic, A Shapiro Prof Corp': '2022-10-01',
  'Bulk or Liquid Transport LLC': '2023-09-01',
  'LIFT Economy': '2023-11-01',
  'Petersen Surveying': '2025-11-01',
  'Q90 Corporation': '2023-11-01',
  'Paul T Stallman MD': '2023-11-01',
  'Swift Restoration and Remodeling': '2024-12-01',
  "Tim O'Brien": '2025-12-01',
  'White Olive Direct Primary Care': '2025-12-01',
  'Mud Lake Oil, Inc.': '2026-01-01',
  'Red Rock 911 Restoration, LLC': '2025-11-01',
  'Elite Risk Services': '2019-01-01',
  'Health Watch Provo, INC': '2020-01-01',
  'Oasis Manufacturing, Inc.': '2020-01-01',
  'Domega INC': '2021-01-01',
  'Next Level Realty': '2022-01-01',
  'Mastiff Pro Detailing LLC': '2023-01-01',
  'JobSight LLC': '2025-01-01',
  'New Growth Psychology Inc': '2025-01-01',
  'Coal Creek Mortgage': '2026-01-01',
  'Atlas Outdoors, LLC': '2026-01-01',
  "A Child's Hope Foundation": '2026-01-01',
  'Cedar Valley Construction': '2026-01-01',
  'Trim Worx LLC': '2026-01-01',
  'Three Little Birds Design Build': '2026-01-01',
  'Vacman & Bobbin': '2020-01-01',
  'Water Crest Farms Nursery': '2021-01-01',
  'Heidi L Farrow': '2021-01-01',
  'KG Masonry Services, Inc': '2022-01-01',
  'Capital Advisors Wealth': '2022-01-01',
  'John & Melissa Nelsen DDS INC, DBA: Nelsen Family Dentistry': '2022-01-01',
  'Express Cash Flow LLC': '2022-01-01',
  'Keystone Construction LLC': '2023-01-01',
  'Xcel Now Inc.': '2023-01-01',
  'Ovation Up, INC': '2024-01-01',
  'Kreier Forest Products': '2025-01-01',
  'Seigneur Fox Construction, LLC': '2025-01-01',
  'Marion Family Optometrists, Inc.': '2026-01-01',
  'ASKDRSKIP.COM, PLLC': '2026-01-01',
  'Magnolia Lawn Management': '2026-01-01',
  'Patrick J Panzarella': '2021-02-01',
  'Legacy Electrical Services, Inc.': '2022-02-01',
  'Eidon Ionic Minerals': '2024-02-01',
  'Beyond Compression': '2024-02-01',
  'Mango Tax LLC': '2025-02-01',
  'CAL WESTERN CONVERTING': '2026-02-01',
  'Red Rock Site Development Services LLC': '2026-02-01',
  'New Wave Construction': '2026-02-01',
  HomePro: '2026-02-01',
  'P&M Ventures': '2026-02-01',
  SponsorCloud: '2026-02-01',
  'Pine Ridge Dental': '2026-02-01',
  'Road Trip Oregon': '2026-02-01',
  'Transportation Risk Management Co': '2026-02-01',
}

async function main() {
  const { data: groups, error } = await supabase
    .from('groups')
    .select('id, group_name, status, start_date')

  if (error) {
    console.error('Failed to fetch groups:', error.message)
    process.exit(1)
  }

  const byName = new Map(groups.map((g) => [g.group_name, g]))
  const matchedNames = new Set()
  const results = []

  for (const [name, startDate] of Object.entries(SHEET_START_DATES)) {
    const g = byName.get(name)
    if (!g) {
      results.push({ group: name, status: 'NO MATCH IN DB — check exact spelling' })
      continue
    }
    matchedNames.add(name)
    if (g.start_date) {
      results.push({ group: name, status: 'SKIPPED — start_date already set', existing: g.start_date })
      continue
    }
    const { error: updateError } = await supabase.from('groups').update({ start_date: startDate }).eq('id', g.id)
    results.push({ group: name, status: updateError ? `ERROR: ${updateError.message}` : 'OK', start_date: startDate })
  }

  console.table(results)

  const unmatchedTransitionGroups = groups.filter(
    (g) => g.status === 'transition' && !matchedNames.has(g.group_name),
  )
  if (unmatchedTransitionGroups.length) {
    console.log('\nTransition-status groups with NO entry in the sheet map above (not backfilled):')
    console.table(unmatchedTransitionGroups.map((g) => ({ group: g.group_name, start_date: g.start_date })))
  }

  console.log(`\n${results.length} sheet entries processed.`)
}

main()

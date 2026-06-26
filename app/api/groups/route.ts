import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformGroup, groupPatchToDb } from '@/lib/db-transforms'
import { monAbbr } from '@/lib/dates'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('group_name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(transformGroup))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { groupName, status, renewalDate, employees, currentBM } = body

  if (!groupName?.trim()) {
    return NextResponse.json({ error: 'Group name required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const id = 'g_new_' + Date.now()
  const isTransition = status === 'transition'

  const row = groupPatchToDb({
    groupName: groupName.trim(),
    currentBM: currentBM?.trim() || (isTransition ? '—' : 'You'),
    renewalMonth: renewalDate ? monAbbr(renewalDate) : '',
    renewalDate: renewalDate || null,
    employees: employees ? Number(employees) : null,
    status: status || 'active',
    warmHandoff: !isTransition,
    newContact: !isTransition,
    ownershipTaken: !isTransition,
    sfUpdated: !isTransition,
    changeCompleted: !isTransition,
    priority: false,
    oeMode: 'undecided',
    plansOffered: [],
    cadence: 'quarterly',
  })

  const { data, error } = await supabase
    .from('groups')
    .insert({ id, ...row })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformGroup(data), { status: 201 })
}

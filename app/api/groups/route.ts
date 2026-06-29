import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformGroup } from '@/lib/db-transforms'
import { buildNewGroupRow } from './newGroupDefaults'

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

  if (!body.groupName?.trim()) {
    return NextResponse.json({ error: 'Group name required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const id = 'g_new_' + Date.now()
  const row = buildNewGroupRow(body)

  const { data, error } = await supabase
    .from('groups')
    .insert({ id, ...row })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformGroup(data), { status: 201 })
}

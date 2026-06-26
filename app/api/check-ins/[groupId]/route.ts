import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformCheckIn } from '@/lib/db-transforms'
import { todayISO } from '@/lib/dates'

export async function GET(_: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('check_in_history')
    .select('*')
    .eq('group_id', groupId)
    .order('checked_in', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json([])
  return NextResponse.json(data.map(transformCheckIn))
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const body = await req.json()
  const { checkedIn, source } = body

  const supabase = createServerClient()
  const id = 'ci_' + Date.now()
  const { data, error } = await supabase
    .from('check_in_history')
    .insert({
      id,
      group_id: groupId,
      checked_in: checkedIn || todayISO(),
      source: source || 'manual',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformCheckIn(data), { status: 201 })
}

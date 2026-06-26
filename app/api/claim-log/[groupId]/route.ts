import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformClaimEntry } from '@/lib/db-transforms'

export async function GET(_: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('claim_utilization_log')
    .select('*')
    .eq('group_id', groupId)
    .order('log_date', { ascending: false })

  if (error) return NextResponse.json([])
  return NextResponse.json(data.map(transformClaimEntry))
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const body = await req.json()
  const { logDate, claimsPaid, claimsFund, note } = body

  if (!logDate) return NextResponse.json({ error: 'Log date required' }, { status: 400 })
  if (claimsPaid == null || claimsFund == null) {
    return NextResponse.json({ error: 'Claims paid and fund are required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const id = 'cl_' + Date.now()
  const { data, error } = await supabase
    .from('claim_utilization_log')
    .insert({
      id,
      group_id: groupId,
      log_date: logDate,
      claims_paid: Number(claimsPaid),
      claims_fund: Number(claimsFund),
      note: note?.trim() || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformClaimEntry(data), { status: 201 })
}

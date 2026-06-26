import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformReminder } from '@/lib/db-transforms'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')

  const supabase = createServerClient()
  let query = supabase
    .from('reminders')
    .select('*')
    .eq('completed', false)
    .order('trigger_date')

  if (groupId) {
    query = query.eq('group_id', groupId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json([])
  return NextResponse.json(data.map(transformReminder))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { groupId, triggerDate, note } = body

  if (!triggerDate) return NextResponse.json({ error: 'Trigger date required' }, { status: 400 })

  const supabase = createServerClient()
  const id = 'rem_' + Date.now()
  const { data, error } = await supabase
    .from('reminders')
    .insert({
      id,
      group_id: groupId || null,
      trigger_date: triggerDate,
      note: note?.trim() || '',
      completed: false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformReminder(data), { status: 201 })
}

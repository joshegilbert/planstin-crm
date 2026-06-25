import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformNote } from '@/lib/db-transforms'
import { todayISO } from '@/lib/dates'

export async function GET(_: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(transformNote))
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const body = await req.json()
  const { text, type, date } = body

  if (!text?.trim()) return NextResponse.json({ error: 'Note text required' }, { status: 400 })

  const supabase = createServerClient()
  const id = 'n' + Date.now()
  const { data, error } = await supabase
    .from('notes')
    .insert({
      id,
      group_id: groupId,
      type: type || 'Note',
      text: text.trim(),
      date: date || todayISO(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformNote(data), { status: 201 })
}

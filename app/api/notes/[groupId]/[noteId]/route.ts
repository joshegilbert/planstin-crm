import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformNote } from '@/lib/db-transforms'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string; noteId: string }> },
) {
  const { groupId, noteId } = await params
  const body = await req.json()
  const { text } = body

  if (!text?.trim()) return NextResponse.json({ error: 'Note text required' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('notes')
    .update({ text: text.trim() })
    .eq('id', noteId)
    .eq('group_id', groupId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformNote(data))
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ groupId: string; noteId: string }> },
) {
  const { groupId, noteId } = await params
  const supabase = createServerClient()
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('group_id', groupId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

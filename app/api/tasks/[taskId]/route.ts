import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformTask, taskPatchToDb } from '@/lib/db-transforms'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params
  const body = await req.json()
  const dbPatch = taskPatchToDb(body)

  if (Object.keys(dbPatch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('workflow_tasks')
    .update(dbPatch)
    .eq('id', taskId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformTask(data))
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params
  const supabase = createServerClient()
  const { error } = await supabase.from('workflow_tasks').delete().eq('id', taskId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

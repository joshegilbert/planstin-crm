import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  transformGroup,
  transformNote,
  reconstructWorkflows,
  groupPatchToDb,
} from '@/lib/db-transforms'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()

  const [groupRes, notesRes, workflowsRes, tasksRes] = await Promise.all([
    supabase.from('groups').select('*').eq('id', id).single(),
    supabase.from('notes').select('*').eq('group_id', id).order('created_at', { ascending: false }),
    supabase.from('workflows').select('*').eq('group_id', id).order('created_at'),
    supabase
      .from('workflow_tasks')
      .select('*')
      .in(
        'workflow_id',
        (await supabase.from('workflows').select('id').eq('group_id', id)).data?.map((w) => w.id) ?? [],
      )
      .order('section_order')
      .order('task_order'),
  ])

  if (groupRes.error) {
    return NextResponse.json({ error: groupRes.error.message }, { status: 404 })
  }

  const group = transformGroup(groupRes.data)
  group.notes = (notesRes.data || []).map(transformNote)
  group.workflows = reconstructWorkflows(workflowsRes.data || [], tasksRes.data || [])

  return NextResponse.json(group)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const dbPatch = groupPatchToDb(body)

  if (Object.keys(dbPatch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('groups')
    .update(dbPatch)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformGroup(data))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()
  const { error } = await supabase.from('groups').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

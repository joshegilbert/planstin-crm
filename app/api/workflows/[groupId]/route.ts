import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { reconstructWorkflows } from '@/lib/db-transforms'
import { todayISO, isoMinus } from '@/lib/dates'

export async function GET(_: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = createServerClient()

  const { data: wfs, error: wfErr } = await supabase
    .from('workflows')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at')

  if (wfErr) return NextResponse.json({ error: wfErr.message }, { status: 500 })

  const wfIds = (wfs || []).map((w) => w.id)
  if (wfIds.length === 0) return NextResponse.json([])

  const { data: tasks, error: taskErr } = await supabase
    .from('workflow_tasks')
    .select('*')
    .in('workflow_id', wfIds)
    .order('section_order')
    .order('task_order')

  if (taskErr) return NextResponse.json({ error: taskErr.message }, { status: 500 })

  return NextResponse.json(reconstructWorkflows(wfs || [], tasks || []))
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params
  const body = await req.json()
  const { templateId, template, anchorDate } = body

  if (!template) return NextResponse.json({ error: 'Template required' }, { status: 400 })

  const supabase = createServerClient()
  const wfId = 'wf' + Date.now()

  const { error: wfErr } = await supabase.from('workflows').insert({
    id: wfId,
    group_id: groupId,
    template_id: templateId || null,
    type: template.type,
    title: template.title,
    started_date: todayISO(),
  })

  if (wfErr) return NextResponse.json({ error: wfErr.message }, { status: 500 })

  const taskRows: object[] = []
  let taskCounter = 0

  ;(template.sections || []).forEach((sec: { name: string; tasks: { label: string; offsetDays: number | null }[] }, secIdx: number) => {
    ;(sec.tasks || []).forEach((task: { label: string; offsetDays: number | null }, taskIdx: number) => {
      const due =
        task.offsetDays != null && anchorDate
          ? isoMinus(anchorDate, task.offsetDays)
          : null

      taskRows.push({
        id: 't' + Date.now() + '_' + taskCounter++,
        workflow_id: wfId,
        section_name: sec.name,
        section_order: secIdx,
        task_order: taskIdx,
        label: task.label,
        offset_days: task.offsetDays ?? null,
        due_date: due,
        note: '',
      })
    })
  })

  if (taskRows.length > 0) {
    const { error: taskErr } = await supabase.from('workflow_tasks').insert(taskRows)
    if (taskErr) return NextResponse.json({ error: taskErr.message }, { status: 500 })
  }

  // Return the created workflow with tasks
  const { data: wf } = await supabase.from('workflows').select('*').eq('id', wfId).single()
  const { data: tasks } = await supabase
    .from('workflow_tasks')
    .select('*')
    .eq('workflow_id', wfId)
    .order('section_order')
    .order('task_order')

  return NextResponse.json(reconstructWorkflows([wf], tasks || [])[0], { status: 201 })
}

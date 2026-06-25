import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformTask } from '@/lib/db-transforms'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { workflowId, sectionName, sectionOrder, taskOrder } = body

  if (!workflowId) return NextResponse.json({ error: 'workflowId required' }, { status: 400 })

  const supabase = createServerClient()
  const id = 't' + Date.now()

  const { data, error } = await supabase
    .from('workflow_tasks')
    .insert({
      id,
      workflow_id: workflowId,
      section_name: sectionName,
      section_order: sectionOrder ?? 0,
      task_order: taskOrder ?? 0,
      label: 'New task',
      note: '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformTask(data), { status: 201 })
}

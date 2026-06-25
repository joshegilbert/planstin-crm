import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformTemplate } from '@/lib/db-transforms'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json()
  const supabase = createServerClient()

  const allowed: Record<string, unknown> = {}
  if (body.title !== undefined) allowed.title = body.title
  if (body.sections !== undefined) allowed.sections = body.sections
  if (body.anchor !== undefined) allowed.anchor = body.anchor
  if (body.autoStartDays !== undefined) allowed.auto_start_days = body.autoStartDays

  const { data, error } = await supabase
    .from('workflow_templates')
    .update(allowed)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformTemplate(data))
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = createServerClient()

  // Only allow deleting custom (non-builtin) templates
  const { data: tpl } = await supabase
    .from('workflow_templates')
    .select('builtin')
    .eq('id', id)
    .single()

  if (tpl?.builtin) {
    return NextResponse.json({ error: 'Cannot delete built-in templates' }, { status: 403 })
  }

  const { error } = await supabase.from('workflow_templates').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

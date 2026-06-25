import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformTemplate } from '@/lib/db-transforms'
import { DEFAULT_WORKFLOW_TEMPLATES } from '@/constants/workflow-templates'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('workflow_templates')
    .select('*')
    .order('builtin', { ascending: false })
    .order('title')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If no templates in DB, return defaults
  if (!data || data.length === 0) {
    return NextResponse.json(DEFAULT_WORKFLOW_TEMPLATES)
  }

  return NextResponse.json(data.map(transformTemplate))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createServerClient()
  const id = 'tpl_custom_' + Date.now()

  const { data, error } = await supabase
    .from('workflow_templates')
    .insert({
      id,
      type: 'custom',
      title: body.title || 'New workflow',
      builtin: false,
      anchor: null,
      auto_start_days: null,
      sections: body.sections || [{ name: 'Tasks', tasks: [] }],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformTemplate(data), { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformPlanCatalogItem } from '@/lib/db-transforms'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json()
  const patch: Record<string, unknown> = {}
  if (body.planName !== undefined) patch.plan_name = body.planName.trim()
  if (body.familyName !== undefined) patch.family_name = body.familyName.trim()
  if (body.sortOrder !== undefined) patch.sort_order = body.sortOrder
  if (body.isActive !== undefined) patch.is_active = body.isActive

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('plan_catalog')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformPlanCatalogItem(data))
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = createServerClient()
  const { error } = await supabase.from('plan_catalog').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

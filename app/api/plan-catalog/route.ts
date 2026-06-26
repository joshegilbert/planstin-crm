import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformPlanCatalogItem } from '@/lib/db-transforms'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year')

  const supabase = createServerClient()
  let query = supabase
    .from('plan_catalog')
    .select('*')
    .eq('is_active', true)
    .order('family_name')
    .order('sort_order')

  if (year) {
    query = query.eq('plan_year', Number(year))
  }

  const { data, error } = await query
  if (error) return NextResponse.json([])
  return NextResponse.json(data.map(transformPlanCatalogItem))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { planYear, familyName, planName, sortOrder } = body

  if (!planYear || !familyName?.trim() || !planName?.trim()) {
    return NextResponse.json({ error: 'planYear, familyName, and planName are required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const id = 'pc_' + Date.now()
  const { data, error } = await supabase
    .from('plan_catalog')
    .insert({
      id,
      plan_year: Number(planYear),
      family_name: familyName.trim(),
      plan_name: planName.trim(),
      sort_order: sortOrder ?? 0,
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformPlanCatalogItem(data), { status: 201 })
}

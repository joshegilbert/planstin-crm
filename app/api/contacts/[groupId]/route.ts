import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformContact } from '@/lib/db-transforms'

export async function GET(_: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('group_contacts')
    .select('*')
    .eq('group_id', groupId)
    .order('is_primary', { ascending: false })
    .order('created_at')

  if (error) return NextResponse.json([])
  return NextResponse.json(data.map(transformContact))
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const body = await req.json()
  const { name, role, email, phone, isPrimary } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const supabase = createServerClient()

  if (isPrimary) {
    await supabase
      .from('group_contacts')
      .update({ is_primary: false })
      .eq('group_id', groupId)
  }

  const id = 'gc_' + Date.now()
  const { data, error } = await supabase
    .from('group_contacts')
    .insert({
      id,
      group_id: groupId,
      name: name.trim(),
      role: role?.trim() || '',
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      is_primary: isPrimary ?? false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformContact(data), { status: 201 })
}

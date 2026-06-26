import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { transformContact } from '@/lib/db-transforms'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string; contactId: string }> },
) {
  const { groupId, contactId } = await params
  const body = await req.json()
  const { name, role, email, phone, isPrimary } = body

  const supabase = createServerClient()

  if (isPrimary) {
    await supabase
      .from('group_contacts')
      .update({ is_primary: false })
      .eq('group_id', groupId)
  }

  const patch: Record<string, unknown> = {}
  if (name !== undefined) patch.name = name.trim()
  if (role !== undefined) patch.role = role.trim()
  if (email !== undefined) patch.email = email.trim()
  if (phone !== undefined) patch.phone = phone.trim()
  if (isPrimary !== undefined) patch.is_primary = isPrimary

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('group_contacts')
    .update(patch)
    .eq('id', contactId)
    .eq('group_id', groupId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(transformContact(data))
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ groupId: string; contactId: string }> },
) {
  const { groupId, contactId } = await params
  const supabase = createServerClient()
  const { error } = await supabase
    .from('group_contacts')
    .delete()
    .eq('id', contactId)
    .eq('group_id', groupId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ groupId: string; entryId: string }> },
) {
  const { groupId, entryId } = await params
  const supabase = createServerClient()
  const { error } = await supabase
    .from('claim_utilization_log')
    .delete()
    .eq('id', entryId)
    .eq('group_id', groupId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

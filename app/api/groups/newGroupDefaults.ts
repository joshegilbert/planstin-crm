import { groupPatchToDb } from '@/lib/db-transforms'
import { monAbbr } from '@/lib/dates'

// Extracted out of route.ts (Next.js route files may only export HTTP-method handlers, not
// arbitrary functions) so the defaulting logic — what a brand-new group looks like before
// it's inserted — can be unit tested without a live Supabase connection.
export function buildNewGroupRow(body: {
  groupName: string
  status?: string
  renewalDate?: string | null
  employees?: number | string | null
  currentBM?: string
}) {
  const isTransition = body.status === 'transition'
  return groupPatchToDb({
    groupName: body.groupName.trim(),
    currentBM: body.currentBM?.trim() || (isTransition ? '—' : 'You'),
    renewalMonth: body.renewalDate ? monAbbr(body.renewalDate) : '',
    renewalDate: body.renewalDate || null,
    employees: body.employees ? Number(body.employees) : null,
    status: body.status || 'active',
    warmHandoff: !isTransition,
    newContact: !isTransition,
    ownershipTaken: !isTransition,
    sfUpdated: !isTransition,
    changeCompleted: !isTransition,
    priority: false,
    oeMode: 'undecided',
    plansOffered: [],
    cadence: 'quarterly',
  })
}

import type { Group, Note, Workflow, WorkflowSection, WorkflowTask, WorkflowTemplate } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformGroup(row: any): Group {
  return {
    id: row.id,
    groupName: row.group_name,
    currentBM: row.current_bm || '',
    renewalMonth: row.renewal_month || '',
    renewalDate: row.renewal_date || null,
    status: row.status,
    priority: row.priority ?? false,
    fullOwnership: row.full_ownership || null,
    commissionEffective: row.commission_effective || null,
    transitionTimeline: row.transition_timeline || '',
    warmHandoff: row.warm_handoff ?? false,
    warmHandoffDate: row.warm_handoff_date || null,
    newContact: row.new_contact ?? false,
    ownershipTaken: row.ownership_taken ?? false,
    sfUpdated: row.sf_updated ?? false,
    changeCompleted: row.change_completed ?? false,
    introEmailDate: row.intro_email_date || null,
    employees: row.employees ?? null,
    activeOnPlans: row.active_on_plans ?? null,
    fte: row.fte ?? null,
    state: row.state || '',
    agent: row.agent || '',
    contributions: row.contributions || '',
    participation: row.participation || '',
    planRichness: row.plan_richness || '',
    claimsFund: row.claims_fund || '',
    plans: row.plans || '',
    platform: row.platform || '',
    plansOffered: row.plans_offered || [],
    contactName: row.contact_name || '',
    contactEmail: row.contact_email || '',
    contactPhone: row.contact_phone || '',
    gcRole: row.gc_role || '',
    salesforceLink: row.salesforce_link || '',
    cadence: row.cadence || '',
    customCadenceDays: row.custom_cadence_days ?? null,
    lastCheckIn: row.last_check_in || null,
    nextCheckIn: row.next_check_in || null,
    followUpDate: row.follow_up_date || null,
    followUpNote: row.follow_up_note || '',
    oeMode: row.oe_mode || 'undecided',
    oeStartDate: row.oe_start_date || null,
    oeEndDate: row.oe_end_date || null,
    asaSigned: row.asa_signed ?? false,
    oeDecisionNote: row.oe_decision_note || '',
    nhoStatus: row.nho_status || '',
    nhoNote: row.nho_note || '',
    watchOuts: row.watch_outs || '',
    monitorMonthly: row.monitor_monthly ?? false,
    lastMonitor: row.last_monitor || null,
    snoozedUntil: row.snoozed_until || null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformNote(row: any): Note {
  return {
    id: row.id,
    groupId: row.group_id,
    type: row.type,
    text: row.text,
    date: row.date,
    createdAt: row.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformTask(row: any): WorkflowTask {
  return {
    id: row.id,
    workflowId: row.workflow_id,
    sectionName: row.section_name,
    sectionOrder: row.section_order,
    taskOrder: row.task_order,
    label: row.label,
    offsetDays: row.offset_days ?? null,
    dueDate: row.due_date || null,
    assignedDate: row.assigned_date || null,
    completedDate: row.completed_date || null,
    reminderDate: row.reminder_date || null,
    note: row.note || '',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reconstructWorkflows(workflows: any[], tasks: any[]): Workflow[] {
  return workflows.map((wf) => {
    const wfTasks = tasks.filter((t) => t.workflow_id === wf.id)

    const sectionMap = new Map<number, { name: string; tasks: WorkflowTask[] }>()
    for (const task of wfTasks) {
      if (!sectionMap.has(task.section_order)) {
        sectionMap.set(task.section_order, { name: task.section_name, tasks: [] })
      }
      sectionMap.get(task.section_order)!.tasks.push(transformTask(task))
    }

    const sections: WorkflowSection[] = Array.from(sectionMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([, sec]) => ({
        name: sec.name,
        tasks: sec.tasks.sort((a, b) => a.taskOrder - b.taskOrder),
      }))

    return {
      id: wf.id,
      groupId: wf.group_id,
      templateId: wf.template_id || null,
      type: wf.type,
      title: wf.title,
      startedDate: wf.started_date,
      sections,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformTemplate(row: any): WorkflowTemplate {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    builtin: row.builtin ?? false,
    anchor: row.anchor || null,
    autoStartDays: row.auto_start_days ?? null,
    sections: row.sections || [],
  }
}

// Convert camelCase Group patch to snake_case DB columns
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupPatchToDb(patch: Record<string, any>): Record<string, any> {
  const map: Record<string, string> = {
    groupName: 'group_name',
    currentBM: 'current_bm',
    renewalMonth: 'renewal_month',
    renewalDate: 'renewal_date',
    status: 'status',
    priority: 'priority',
    fullOwnership: 'full_ownership',
    commissionEffective: 'commission_effective',
    transitionTimeline: 'transition_timeline',
    warmHandoff: 'warm_handoff',
    warmHandoffDate: 'warm_handoff_date',
    newContact: 'new_contact',
    ownershipTaken: 'ownership_taken',
    sfUpdated: 'sf_updated',
    changeCompleted: 'change_completed',
    introEmailDate: 'intro_email_date',
    employees: 'employees',
    activeOnPlans: 'active_on_plans',
    fte: 'fte',
    state: 'state',
    agent: 'agent',
    contributions: 'contributions',
    participation: 'participation',
    planRichness: 'plan_richness',
    claimsFund: 'claims_fund',
    plans: 'plans',
    platform: 'platform',
    plansOffered: 'plans_offered',
    contactName: 'contact_name',
    contactEmail: 'contact_email',
    contactPhone: 'contact_phone',
    gcRole: 'gc_role',
    salesforceLink: 'salesforce_link',
    cadence: 'cadence',
    customCadenceDays: 'custom_cadence_days',
    lastCheckIn: 'last_check_in',
    nextCheckIn: 'next_check_in',
    followUpDate: 'follow_up_date',
    followUpNote: 'follow_up_note',
    oeMode: 'oe_mode',
    oeStartDate: 'oe_start_date',
    oeEndDate: 'oe_end_date',
    asaSigned: 'asa_signed',
    oeDecisionNote: 'oe_decision_note',
    nhoStatus: 'nho_status',
    nhoNote: 'nho_note',
    watchOuts: 'watch_outs',
    monitorMonthly: 'monitor_monthly',
    lastMonitor: 'last_monitor',
    snoozedUntil: 'snoozed_until',
  }

  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(patch)) {
    const dbKey = map[key]
    if (dbKey) result[dbKey] = val
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function taskPatchToDb(patch: Record<string, any>): Record<string, any> {
  const map: Record<string, string> = {
    label: 'label',
    dueDate: 'due_date',
    assignedDate: 'assigned_date',
    completedDate: 'completed_date',
    reminderDate: 'reminder_date',
    note: 'note',
    sectionName: 'section_name',
    taskOrder: 'task_order',
  }
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(patch)) {
    const dbKey = map[key]
    if (dbKey) result[dbKey] = val
  }
  return result
}

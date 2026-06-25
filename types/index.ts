export type GroupStatus =
  | 'transition'
  | 'onboarding'
  | 'active'
  | 'open-enrollment'
  | 'renewal'
  | 'at-risk'
  | 'parked'

export type PlanRichness = 'Lean' | 'Standard' | 'Rich' | 'Mixed' | ''
export type Platform =
  | 'Employee Navigator'
  | 'Planstin Portals / Salesforce'
  | 'Both'
  | 'Other'
  | ''
export type Cadence = 'monthly' | 'quarterly' | 'custom' | ''
export type OeMode = 'undecided' | 'active' | 'passive'
export type NhoStatus = 'not-required' | 'tbd' | 'recurring' | 'scheduled' | ''
export type OeWindow = 'now' | 'soon' | 'future' | 'passed' | 'none'
export type NoteType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Check-in' | 'Monitor'
export type ListFilter =
  | 'all'
  | 'reachout'
  | 'oenow'
  | 'oe90'
  | 'transition'
  | 'followup'
  | 'priority'
export type SortOption = 'priority' | 'name' | 'renewal' | 'employees'

export interface Note {
  id: string
  groupId: string
  type: NoteType
  text: string
  date: string // ISO date
  createdAt?: string
}

export interface WorkflowTask {
  id: string
  workflowId: string
  sectionName: string
  sectionOrder: number
  taskOrder: number
  label: string
  offsetDays: number | null
  dueDate: string | null
  assignedDate: string | null
  completedDate: string | null
  reminderDate: string | null
  note: string
}

export interface WorkflowSection {
  name: string
  tasks: WorkflowTask[]
}

export interface Workflow {
  id: string
  groupId: string
  templateId: string | null
  type: string
  title: string
  startedDate: string
  sections: WorkflowSection[]
}

export interface TemplateTask {
  label: string
  offsetDays: number | null
}

export interface TemplateSection {
  name: string
  tasks: TemplateTask[]
}

export interface WorkflowTemplate {
  id: string
  type: string
  title: string
  builtin: boolean
  anchor: 'renewal' | 'oe' | null
  autoStartDays?: number | null
  sections: TemplateSection[]
}

export interface Group {
  id: string

  // Identity
  groupName: string
  currentBM: string
  state: string
  agent: string
  platform: Platform
  salesforceLink: string

  // Renewal
  renewalMonth: string
  renewalDate: string | null

  // Status
  status: GroupStatus
  priority: boolean

  // Transition
  fullOwnership: string | null
  commissionEffective: string | null
  transitionTimeline: string
  warmHandoff: boolean
  warmHandoffDate: string | null
  newContact: boolean
  ownershipTaken: boolean
  sfUpdated: boolean
  changeCompleted: boolean
  introEmailDate: string | null

  // Business
  employees: number | null
  activeOnPlans: number | null
  fte: number | null
  planRichness: PlanRichness
  claimsFund: string
  contributions: string
  participation: string
  plans: string
  plansOffered: string[]

  // Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  gcRole: string

  // Check-in
  cadence: Cadence
  customCadenceDays: number | null
  lastCheckIn: string | null
  nextCheckIn: string | null

  // Follow-up
  followUpDate: string | null
  followUpNote: string

  // Open enrollment
  oeMode: OeMode
  oeStartDate: string | null
  oeEndDate: string | null
  asaSigned: boolean
  oeDecisionNote: string

  // NHO
  nhoStatus: NhoStatus
  nhoNote: string

  // Watch-outs
  watchOuts: string
  monitorMonthly: boolean
  lastMonitor: string | null

  // Snooze
  snoozedUntil: string | null

  // Relations
  workflows?: Workflow[]
  notes?: Note[]
}

export interface ReachOutReason {
  label: string
  tone: 'urgent' | 'warn' | 'accent' | 'neutral'
}

export interface GroupViewModel extends Group {
  score: number
  reasons: ReachOutReason[]
  oeWindow: OeWindow
  oeDateText: string
  wfDoneAll: number
  wfTotalAll: number
  wfPct: number
  wfCount: number
  snoozed: boolean
  renewalDays: number | null
  renewalSub: string
  transitionStep: string
  checkInDue: boolean
  checkInText: string
  followUpDue: boolean
  followUpText: string
  monitorDue: boolean
  actionDetail: string
  dueText: string
  dueTone: 'urgent' | 'warn' | 'accent' | 'neutral'
  cadenceLabel: string
  hasTransitionWf: boolean
  hasRenewalWf: boolean
  renewalStartSuggest: boolean
}

export interface PlanFamily {
  name: string
  plans: string[]
}

export interface DashboardCounts {
  reach: number
  oeNow: number
  oe90: number
  followUps: number
  flagged: number
  total: number
}

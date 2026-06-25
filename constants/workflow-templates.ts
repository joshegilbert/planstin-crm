import type { WorkflowTemplate } from '@/types'

export const DEFAULT_WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tpl_oe',
    type: 'oe',
    title: 'Open Enrollment',
    builtin: true,
    anchor: 'oe',
    autoStartDays: null,
    sections: [
      {
        name: 'Planning',
        tasks: [
          { label: 'Initial Meeting', offsetDays: null },
          { label: 'Confirm Plans', offsetDays: null },
          { label: 'Confirm Contributions', offsetDays: null },
        ],
      },
      {
        name: 'Documentation',
        tasks: [
          { label: 'Send ASA / BSA', offsetDays: null },
          { label: 'Receive ASA / BSA', offsetDays: null },
          { label: 'Send Census', offsetDays: null },
          { label: 'Receive Census', offsetDays: null },
        ],
      },
      {
        name: 'Communication',
        tasks: [
          { label: 'Create Landing Page', offsetDays: null },
          { label: 'Create Flyer', offsetDays: null },
          { label: 'Approve Flyer', offsetDays: null },
          { label: 'Send Flyer', offsetDays: null },
        ],
      },
      {
        name: 'Enrollment',
        tasks: [
          { label: 'Schedule Demo', offsetDays: null },
          { label: 'Conduct Demo', offsetDays: null },
          { label: 'Midpoint Review', offsetDays: null },
          { label: 'Enrollment Analysis', offsetDays: null },
        ],
      },
      {
        name: 'Completion',
        tasks: [
          { label: 'Send Invoice', offsetDays: null },
          { label: 'Confirm Invoice', offsetDays: null },
          { label: 'Send Section 125 Documents', offsetDays: null },
          { label: 'Schedule Ongoing Service Meetings', offsetDays: null },
        ],
      },
    ],
  },
  {
    id: 'tpl_renewal',
    type: 'renewal',
    title: 'Renewal',
    builtin: true,
    anchor: 'renewal',
    autoStartDays: 90,
    sections: [
      {
        name: 'Timeline',
        tasks: [
          { label: 'Initial Outreach', offsetDays: 90 },
          { label: 'Renewal Review Meeting', offsetDays: 75 },
          { label: 'Confirm Changes', offsetDays: 60 },
          { label: 'Finalize Plan Design', offsetDays: 45 },
          { label: 'Launch Open Enrollment', offsetDays: 30 },
          { label: 'Enrollment Review', offsetDays: 15 },
          { label: 'Renewal Complete', offsetDays: 0 },
        ],
      },
    ],
  },
  {
    id: 'tpl_transition',
    type: 'transition',
    title: 'Transition',
    builtin: true,
    anchor: null,
    autoStartDays: null,
    sections: [
      {
        name: 'Hand-off',
        tasks: [
          { label: 'Warm hand-off received', offsetDays: null },
          { label: 'Intro / welcome call made', offsetDays: null },
          { label: 'Take full ownership', offsetDays: null },
        ],
      },
      {
        name: 'Setup',
        tasks: [
          { label: 'Update account owner in Salesforce', offsetDays: null },
          { label: 'Confirm plans & contributions', offsetDays: null },
          { label: 'Schedule first service meeting', offsetDays: null },
          { label: 'Transition complete', offsetDays: null },
        ],
      },
    ],
  },
]

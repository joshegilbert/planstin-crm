// Default workflow templates + plan families for the Benefit Manager CRM.
// Templates are seeds — the manager can edit them (stored in localStorage) and
// attach a copy to any group, then add/remove tasks and adjust dates per group.

window.PLAN_FAMILIES = [
  { name: 'Preventive', plans: ['Preventive Core', 'Preventive HSA', 'Preventive Copay'] },
  { name: 'Care+', plans: ['Care+ Core', 'Care+ HSA', 'Care+ Copay 1500', 'Care+ Copay 2500', 'Care+ Copay 3500', 'Care+ Direct'] },
  { name: 'Zion & Virtual Care', plans: ['Zion HealthShare', 'Virtual Care', 'Primary Care', 'Advanced Care'] },
  { name: 'Dental', plans: ['Dental Care', 'Dental Elite'] },
  { name: 'Vision', plans: ['Vision'] },
  { name: 'Supplemental', plans: ['Occupational Accident', 'Give Easy Accident', 'Give Easy Critical Illness', 'Give Easy Hospital'] }
];

// task entries are either a string (label) or { label, offset } where offset =
// number of days BEFORE the anchor date the task is due (used for auto-dating).
window.WORKFLOW_TEMPLATES = [
  {
    id: 'tpl_oe',
    type: 'oe',
    title: 'Open Enrollment',
    builtin: true,
    anchor: 'oe',        // due dates count back from OE start date
    sections: [
      { name: 'Planning', tasks: ['Initial Meeting', 'Confirm Plans', 'Confirm Contributions'] },
      { name: 'Documentation', tasks: ['Send ASA / BSA', 'Receive ASA / BSA', 'Send Census', 'Receive Census'] },
      { name: 'Communication', tasks: ['Create Landing Page', 'Create Flyer', 'Approve Flyer', 'Send Flyer'] },
      { name: 'Enrollment', tasks: ['Schedule Demo', 'Conduct Demo', 'Midpoint Review', 'Enrollment Analysis'] },
      { name: 'Completion', tasks: ['Send Invoice', 'Confirm Invoice', 'Send Section 125 Documents', 'Schedule Ongoing Service Meetings'] }
    ]
  },
  {
    id: 'tpl_renewal',
    type: 'renewal',
    title: 'Renewal',
    builtin: true,
    anchor: 'renewal',   // due dates count back from renewal date
    autoStartDays: 90,   // workflow is suggested 90 days out
    sections: [
      { name: 'Timeline', tasks: [
        { label: 'Initial Outreach', offset: 90 },
        { label: 'Renewal Review Meeting', offset: 75 },
        { label: 'Confirm Changes', offset: 60 },
        { label: 'Finalize Plan Design', offset: 45 },
        { label: 'Launch Open Enrollment', offset: 30 },
        { label: 'Enrollment Review', offset: 15 },
        { label: 'Renewal Complete', offset: 0 }
      ] }
    ]
  },
  {
    id: 'tpl_transition',
    type: 'transition',
    title: 'Transition',
    builtin: true,
    anchor: null,
    sections: [
      { name: 'Hand-off', tasks: ['Warm hand-off received', 'Intro / welcome call made', 'Take full ownership'] },
      { name: 'Setup', tasks: ['Update account owner in Salesforce', 'Confirm plans & contributions', 'Schedule first service meeting', 'Transition complete'] }
    ]
  }
];

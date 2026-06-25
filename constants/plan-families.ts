import type { PlanFamily } from '@/types'

export const PLAN_FAMILIES: PlanFamily[] = [
  {
    name: 'Preventive',
    plans: ['Preventive Core', 'Preventive HSA', 'Preventive Copay'],
  },
  {
    name: 'Care+',
    plans: [
      'Care+ Core',
      'Care+ HSA',
      'Care+ Copay 1500',
      'Care+ Copay 2500',
      'Care+ Copay 3500',
      'Care+ Direct',
    ],
  },
  {
    name: 'Zion & Virtual Care',
    plans: ['Zion HealthShare', 'Virtual Care', 'Primary Care', 'Advanced Care'],
  },
  {
    name: 'Dental',
    plans: ['Dental Care', 'Dental Elite'],
  },
  {
    name: 'Vision',
    plans: ['Vision'],
  },
  {
    name: 'Supplemental',
    plans: [
      'Occupational Accident',
      'Give Easy Accident',
      'Give Easy Critical Illness',
      'Give Easy Hospital',
    ],
  },
]

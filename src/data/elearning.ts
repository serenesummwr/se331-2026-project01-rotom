import type { ELearningItem } from '@/types'

export const elearning: ELearningItem[] = [
  // Level 1
  {
    id: 1,
    levelId: 1,
    title: 'Opening your CAT Passport',
    description:
      'What the passport is, what the Service does for you at Level 1, and how the four levels fit together. Start here.',
    videoUrl: 'https://www.youtube.com/embed/nhBVL41-_Cw',
    duration: '6:12',
  },
  {
    id: 2,
    levelId: 1,
    title: 'Using Service Basic Lookup',
    description:
      'A walkthrough of the fifty monthly lookups a Level 1 member gets, how the passport wallet stores your results, and where the community forum fits in.',
    videoUrl: 'https://www.youtube.com/embed/YrxBCBibVo0',
    duration: '8:45',
  },
  // Level 2
  {
    id: 3,
    levelId: 2,
    title: 'Bulk Lookup and shared workspaces',
    description:
      'Level 2 members can batch 500 records at a time and pull five people into a workspace. This lesson covers both, plus the etiquette of a shared workspace.',
    videoUrl: 'https://www.youtube.com/embed/qZXt1Aom3Cs',
    duration: '11:30',
  },
  {
    id: 4,
    levelId: 2,
    title: 'Getting reports to arrive on their own',
    description:
      'Set up scheduled reports, read the weekly digest, and learn which numbers actually predict whether you are ready for the Level 3 exam.',
    videoUrl: 'https://www.youtube.com/embed/JmzrKUqbJ-A',
    duration: '9:04',
  },
  // Level 3
  {
    id: 5,
    levelId: 3,
    title: 'Automations, webhooks and the sandbox',
    description:
      'The Level 3 toolkit: trigger Service actions from your own webhooks and rehearse every change in the sandbox before it touches real data.',
    videoUrl: 'https://www.youtube.com/embed/wBpEEJ0aA6c',
    duration: '14:22',
  },
  {
    id: 6,
    levelId: 3,
    title: 'The analytics console end to end',
    description:
      'Build a dashboard, export a report, and use the partner directory to find someone who has already solved your problem.',
    videoUrl: 'https://www.youtube.com/embed/DHjqpvDnNGE',
    duration: '12:58',
  },
  // Level 4
  {
    id: 7,
    levelId: 4,
    title: 'Life at the top of the passport',
    description:
      'There is no exam after this one. What the concierge desk can do for you, how custom integrations get scoped, and what happens at the product council.',
    videoUrl: 'https://www.youtube.com/embed/8SbUC-UaAxE',
    duration: '10:16',
  },
  {
    id: 8,
    levelId: 4,
    title: 'Shaping what ships next',
    description:
      'How Level 4 members read the roadmap, prepare a council proposal, and mentor members coming up through the lower levels.',
    videoUrl: 'https://www.youtube.com/embed/4deVCNJq3qc',
    duration: '13:41',
  },
]

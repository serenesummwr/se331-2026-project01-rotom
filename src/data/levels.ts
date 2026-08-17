import type { Badge, Benefit, Level, Service } from '@/types'


export const levels: Level[] = [
  {
    id: 1,
    name: 'Level 1',
    tagline: 'Where every passport starts',
    description:
      'Every member begins here right after registering. Level 1 unlocks the basics of the Service and the Level 1 eLearning track that prepares you for the first exam.',
    passCriteria: 60,
    accent: 'level-1',
  },
  {
    id: 2,
    name: 'Level 2',
    tagline: 'Faster lanes, longer reach',
    description:
      'Level 2 members have proved they know the fundamentals. The service quota grows, support answers faster, and the Level 2 track opens up the collaboration tools.',
    passCriteria: 65,
    accent: 'level-2',
  },
  {
    id: 3,
    name: 'Level 3',
    tagline: 'You steer, we clear the way',
    description:
      'Level 3 members run their own workspaces. Priority routing, analytics and the partner network come with this level, together with a considerably harder exam.',
    passCriteria: 70,
    accent: 'level-3',
  },
  {
    id: 4,
    name: 'Level 4',
    tagline: 'The top of the passport',
    description:
      'The final level of the CAT Passport. Level 4 members get everything the service offers, a dedicated contact, and an invitation to shape what ships next.',
    passCriteria: 75,
    accent: 'level-4',
  },
]
export const benefits: Benefit[] = [
  // Level 1
  { id: 1, levelId: 1, title: 'Welcome passport', description: 'A digital passport with your Level 1 stamp and member number.', icon: 'stamp' },
  { id: 2, levelId: 1, title: 'Community access', description: 'Read and post in the member community forums.', icon: 'message-square' },
  { id: 3, levelId: 1, title: 'Starter eLearning', description: 'The full Level 1 learning track, free and unlimited.', icon: 'video' },
  { id: 4, levelId: 1, title: 'Monthly digest', description: 'A monthly summary of what changed in the Service.', icon: 'newspaper' },
  // Level 2
  { id: 5, levelId: 2, title: 'Priority support', description: 'Your tickets are answered within one business day.', icon: 'zap' },
  { id: 6, levelId: 2, title: 'Double quota', description: 'Twice the monthly Service quota of a Level 1 member.', icon: 'trending-up' },
  { id: 7, levelId: 2, title: 'Level 2 stamp', description: 'The Level 2 stamp on your passport and profile badge shelf.', icon: 'award' },
  { id: 8, levelId: 2, title: 'Workshop seats', description: 'Two seats per quarter in the live online workshops.', icon: 'ticket' },
  // Level 3
  { id: 9, levelId: 3, title: 'Priority routing', description: 'Your requests jump the queue across every Service.', icon: 'rocket' },
  { id: 10, levelId: 3, title: 'Analytics console', description: 'Usage dashboards and exportable reports for your workspace.', icon: 'chart-column' },
  { id: 11, levelId: 3, title: 'Partner network', description: 'Introductions to the partner network and its member rates.', icon: 'handshake' },
  { id: 12, levelId: 3, title: 'Early access', description: 'Try new Service features one release before everyone else.', icon: 'flask-conical' },
  // Level 4
  { id: 13, levelId: 4, title: 'Dedicated contact', description: 'A named contact who knows your account by heart.', icon: 'phone' },
  { id: 14, levelId: 4, title: 'Unlimited quota', description: 'No monthly ceiling on any part of the Service.', icon: 'infinity' },
  { id: 15, levelId: 4, title: 'Product council', description: 'A standing seat in the quarterly product council.', icon: 'vote' },
  { id: 16, levelId: 4, title: 'Level 4 gold stamp', description: 'The gold stamp — the last one the passport has to give.', icon: 'crown' },
]
export const services: Service[] = [
  // Level 1
  { id: 1, levelId: 1, name: 'Service Basic Lookup', description: 'Look up any record in the Service directory, 50 times a month.', category: 'Core' },
  { id: 2, levelId: 1, name: 'Community Forum', description: 'Ask questions and answer other members.', category: 'Community' },
  { id: 3, levelId: 1, name: 'Passport Wallet', description: 'Keep your stamps and certificates in one place.', category: 'Core' },
  // Level 2
  { id: 4, levelId: 2, name: 'Service Bulk Lookup', description: 'Batch up to 500 records in a single request.', category: 'Core' },
  { id: 5, levelId: 2, name: 'Shared Workspaces', description: 'Invite up to five people into a shared workspace.', category: 'Collaboration' },
  { id: 6, levelId: 2, name: 'Scheduled Reports', description: 'Weekly reports delivered to your inbox automatically.', category: 'Insight' },
  // Level 3
  { id: 7, levelId: 3, name: 'Service Automations', description: 'Trigger Service actions from your own webhooks.', category: 'Automation' },
  { id: 8, levelId: 3, name: 'Analytics Console', description: 'Live dashboards over everything your workspace does.', category: 'Insight' },
  { id: 9, levelId: 3, name: 'Partner Directory', description: 'Browse and contact the vetted partner network.', category: 'Network' },
  { id: 10, levelId: 3, name: 'Sandbox Environment', description: 'A throwaway environment to try things safely.', category: 'Automation' },
  // Level 4
  { id: 11, levelId: 4, name: 'Service Unlimited', description: 'Every Service endpoint, no quota, no throttle.', category: 'Core' },
  { id: 12, levelId: 4, name: 'Concierge Desk', description: 'A dedicated human who picks up on the first ring.', category: 'Support' },
  { id: 13, levelId: 4, name: 'Custom Integrations', description: 'We build the integration your team needs.', category: 'Automation' },
  { id: 14, levelId: 4, name: 'Council Seat', description: 'Vote on the Service roadmap every quarter.', category: 'Network' },
]

export const badges: Badge[] = [
  { id: 1, levelId: 1, name: 'Level 1 Stamp', description: 'Registered and opened the CAT Passport.', icon: 'compass' },
  { id: 2, levelId: 2, name: 'Level 2 Stamp', description: 'Passed the Level 1 exam.', icon: 'plane-takeoff' },
  { id: 3, levelId: 3, name: 'Level 3 Stamp', description: 'Passed the Level 2 exam.', icon: 'navigation' },
  { id: 4, levelId: 4, name: 'Level 4 Gold', description: 'Passed the Level 3 exam — the passport is complete.', icon: 'crown' },
]
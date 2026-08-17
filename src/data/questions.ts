import type { Question } from '@/types'

export const questions: Question[] = [
  // Level 1
  {
    id: 101,
    levelId: 1,
    question: 'What happens the moment you register for the CAT Passport?',
    choices: [
      'You are placed at Level 1 and can use the Service straight away',
      'You wait for an administrator to approve the account',
      'You are asked to pick any level you like',
      'You start at Level 4 and work downwards',
    ],
    answerIndex: 0,
  },
  {
    id: 102,
    levelId: 1,
    question: 'How does a member move from one level to the next?',
    choices: [
      'By staying registered for six months',
      'By passing the upgrade exam for their current level',
      'By inviting three other members',
      'By asking an administrator directly',
    ],
    answerIndex: 1,
  },
  {
    id: 103,
    levelId: 1,
    question: 'How many levels does the CAT Passport have?',
    choices: ['Three', 'Four', 'Five', 'As many as you unlock'],
    answerIndex: 1,
  },
  {
    id: 104,
    levelId: 1,
    question: 'Do you have to finish the eLearning content before taking the exam?',
    choices: [
      'Yes, the exam stays locked until every video is watched',
      'Yes, but only for Level 1',
      'No, the exam is always available — the content is there to help you pass',
      'No, but a failed attempt locks you out for a week',
    ],
    answerIndex: 2,
  },
  {
    id: 105,
    levelId: 1,
    question: 'What does a Level 1 member get out of the passport wallet?',
    choices: [
      'A place to keep the stamps and certificates they have earned',
      'A monthly cash rebate',
      'A physical card posted to their address',
      'Nothing until they reach Level 2',
    ],
    answerIndex: 0,
  },
  // Level 2
  {
    id: 201,
    levelId: 2,
    question: 'A Level 2 member wants to process 400 records in one go. Which service covers that?',
    choices: ['Service Basic Lookup', 'Service Bulk Lookup', 'Service Automations', 'Service Unlimited'],
    answerIndex: 1,
  },
  {
    id: 202,
    levelId: 2,
    question: 'How many people can a Level 2 member invite into a shared workspace?',
    choices: ['Two', 'Five', 'Ten', 'No limit'],
    answerIndex: 1,
  },
  {
    id: 203,
    levelId: 2,
    question: 'What is the promised response time on a Level 2 support ticket?',
    choices: [
      'Within one business day',
      'Within one hour',
      'Within one week',
      'There is no promise at this level',
    ],
    answerIndex: 0,
  },
  {
    id: 204,
    levelId: 2,
    question: 'Which of these is NOT a Level 2 benefit?',
    choices: ['Double quota', 'Workshop seats', 'Priority support', 'A dedicated contact'],
    answerIndex: 3,
  },
  {
    id: 205,
    levelId: 2,
    question: 'What arrives in your inbox with Scheduled Reports?',
    choices: [
      'A weekly report generated automatically',
      'A daily invoice',
      'A copy of every request you made',
      'Nothing — you have to download reports yourself',
    ],
    answerIndex: 0,
  },
  // Level 3
  {
    id: 301,
    levelId: 3,
    question: 'What does the Level 3 sandbox environment exist for?',
    choices: [
      'Trying changes safely without touching real data',
      'Storing archived reports',
      'Running the exam offline',
      'Hosting the member community forum',
    ],
    answerIndex: 0,
  },
  {
    id: 302,
    levelId: 3,
    question: 'Service Automations are triggered by…',
    choices: ['A monthly schedule only', 'Your own webhooks', 'A support ticket', 'The admin console'],
    answerIndex: 1,
  },
  {
    id: 303,
    levelId: 3,
    question: 'What does "early access" give a Level 3 member?',
    choices: [
      'New features one release before everyone else',
      'A discount on the next renewal',
      'The Level 4 gold stamp in advance',
      'An extra exam attempt',
    ],
    answerIndex: 0,
  },
  {
    id: 304,
    levelId: 3,
    question: 'Priority routing means your requests…',
    choices: [
      'Are queued overnight and processed in bulk',
      'Skip ahead of lower levels across every Service',
      'Are handled by a different data centre',
      'Cost less per call',
    ],
    answerIndex: 1,
  },
  {
    id: 305,
    levelId: 3,
    question: 'Which level introduces the partner directory?',
    choices: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    answerIndex: 2,
  },
  // Level 4
  {
    id: 401,
    levelId: 4,
    question: 'What does a Level 4 member do at the quarterly product council?',
    choices: [
      'Votes on what the Service builds next',
      'Renews their membership',
      'Re-sits the Level 3 exam',
      'Nominates new administrators',
    ],
    answerIndex: 0,
  },
  {
    id: 402,
    levelId: 4,
    question: 'What is the quota on Service Unlimited?',
    choices: ['10,000 calls a month', '100,000 calls a month', 'There is none', 'One per second'],
    answerIndex: 2,
  },
  {
    id: 403,
    levelId: 4,
    question: 'Level 4 is the last level of the passport. What comes after it?',
    choices: [
      'Nothing — the passport is complete',
      'A hidden fifth level',
      'The account resets to Level 1',
      'A separate partner programme',
    ],
    answerIndex: 0,
  },
]
import { ForcedChoicePair } from '../../types';

// 12 spiritual priority forced-choice questions
export const FAITH_STYLE_PAIRS: ForcedChoicePair[] = [
  {
    id: 'fs1',
    optionA: { label: 'I pray for God\'s guidance before dating', value: 'pray-first' },
    optionB: { label: 'I go with my feelings', value: 'feelings-first' },
  },
  {
    id: 'fs2',
    optionA: { label: 'I believe God speaks through spiritual gifts', value: 'gifts-belief' },
    optionB: { label: 'I rely on my own understanding', value: 'own-understanding' },
  },
  {
    id: 'fs3',
    optionA: { label: 'My pastor knows about my dating life', value: 'pastor-knows' },
    optionB: { label: 'I keep my relationships private', value: 'private' },
  },
  {
    id: 'fs4',
    optionA: { label: 'I prefer group dates at church events', value: 'group-dates' },
    optionB: { label: 'I like one-on-one dates away from church', value: 'one-on-one' },
  },
  {
    id: 'fs5',
    optionA: { label: 'Friday night at a worship event', value: 'worship-event' },
    optionB: { label: 'At a movie with friends', value: 'movie-friends' },
  },
  {
    id: 'fs6',
    optionA: { label: 'In conflict, I seek prayer first', value: 'prayer-first' },
    optionB: { label: 'I try to fix it myself', value: 'fix-myself' },
  },
  {
    id: 'fs7',
    optionA: { label: 'Fasting is important for breakthroughs', value: 'fasting-important' },
    optionB: { label: 'I don\'t really fast', value: 'dont-fast' },
  },
  {
    id: 'fs8',
    optionA: { label: 'Pray with partner about the future', value: 'pray-together' },
    optionB: { label: 'Figure it out without prayer', value: 'figure-out' },
  },
  {
    id: 'fs9',
    optionA: { label: 'Comfortable praying aloud with others', value: 'pray-aloud' },
    optionB: { label: 'Prefer to pray privately', value: 'pray-privately' },
  },
  {
    id: 'fs10',
    optionA: { label: 'Spirit-filled means accountability and submission', value: 'accountability' },
    optionB: { label: 'Just being sincere is enough', value: 'sincerity' },
  },
  {
    id: 'fs11',
    optionA: { label: 'If I sense a check in my spirit, I pause', value: 'spirit-check' },
    optionB: { label: 'I move forward if it feels right', value: 'feels-right' },
  },
  {
    id: 'fs12',
    optionA: { label: 'Partner should attend church weekly', value: 'weekly-church' },
    optionB: { label: 'Attendance isn\'t that important', value: 'attendance-flexible' },
  },
];

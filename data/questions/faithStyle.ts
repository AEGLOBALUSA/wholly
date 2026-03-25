import { ForcedChoicePair } from '../../types';

// 10 spiritual priority forced-choice questions
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
    id: 'fs13',
    optionA: { label: 'I want a partner who leads worship or serves in ministry', value: 'ministry-partner' },
    optionB: { label: 'I just want someone who loves Jesus genuinely', value: 'genuine-faith' },
  },
  {
    id: 'fs14',
    optionA: { label: 'I believe in spiritual warfare and pray against it', value: 'spiritual-warfare' },
    optionB: { label: 'I focus on God\'s goodness more than warfare', value: 'goodness-focus' },
  },
];

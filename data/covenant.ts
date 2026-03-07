import { CovenantStatement } from '../types';

// Marriage intent — user picks ONE of these
export const MARRIAGE_OPTIONS: CovenantStatement[] = [
  { id: 'mi1', text: 'I am pursuing marriage.' },
  { id: 'mi2', text: 'I am here to build a meaningful, God-honouring relationship that leads to marriage.' },
];

// Standard covenant — user must agree to ALL of these
export const COVENANT_STATEMENTS: CovenantStatement[] = [
  { id: 'c2', text: 'I commit to honesty, authenticity, and respect in every interaction on this platform.' },
  { id: 'c3', text: 'I am willing to be accountable for my behavior in this community and will not harass, mislead, or pressure another user.' },
  { id: 'c4', text: 'I will not use prophetic language, dreams, or spiritual authority to manipulate or pressure someone.' },
  { id: 'c5', text: 'I commit to seeking God\'s will and Spirit-led behavior in my relationships.' },
  { id: 'c6', text: 'I understand that WHOLLY reserves the right to remove anyone who violates this covenant.' },
];

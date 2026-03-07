import { ForcedChoicePair } from '../../types';

// 3 lie scale questions from the spec
export const HONESTY_CHECK_PAIRS: ForcedChoicePair[] = [
  {
    id: 'hc1',
    optionA: { label: 'I have never had a doubt about my faith', value: 'never-doubted' },
    optionB: { label: 'I have wrestled with questions about God', value: 'have-wrestled' },
  },
  {
    id: 'hc2',
    optionA: { label: 'I always feel God\'s presence when I pray', value: 'always-feel' },
    optionB: { label: 'Sometimes prayer feels dry or distant', value: 'sometimes-dry' },
  },
  {
    id: 'hc3',
    optionA: { label: 'I have never been angry at God', value: 'never-angry' },
    optionB: { label: 'I have had moments of frustration with God', value: 'have-frustrated' },
  },
];

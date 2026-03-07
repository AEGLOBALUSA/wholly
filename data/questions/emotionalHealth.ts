import { Question } from '../../types';

export const EMOTIONAL_HEALTH_QUESTIONS: Question[] = [
  {
    id: 'eh1',
    text: 'When someone I care about pulls away, I tend to:',
    type: 'single-choice',
    category: 'emotionalHealth',
    required: true,
    options: [
      { id: 'eh1b', label: 'Feel anxious and reach out more', value: 'anxious' },
      { id: 'eh1c', label: 'Feel relieved and enjoy independence', value: 'avoidant' },
      { id: 'eh1a', label: 'Give them space and trust', value: 'secure' },
      { id: 'eh1d', label: 'Feel confused and unsure', value: 'disorganized' },
    ],
  },
  {
    id: 'eh2',
    text: 'In relationships, I find it:',
    type: 'single-choice',
    category: 'emotionalHealth',
    required: true,
    options: [
      { id: 'eh2c', label: 'Difficult to fully trust or depend on others', value: 'avoidant' },
      { id: 'eh2a', label: 'Natural to depend on others mutually', value: 'secure' },
      { id: 'eh2d', label: 'Conflicted — want closeness but fear it', value: 'disorganized' },
      { id: 'eh2b', label: 'Easy to get close but worry about abandonment', value: 'anxious' },
    ],
  },
  {
    id: 'eh3',
    text: "When I'm upset with my partner, I usually:",
    type: 'single-choice',
    category: 'emotionalHealth',
    required: true,
    options: [
      { id: 'eh3b', label: 'Need to talk immediately or I spiral', value: 'anxious' },
      { id: 'eh3d', label: 'Alternate between closeness and pushing away', value: 'disorganized' },
      { id: 'eh3c', label: 'Need time alone to process', value: 'avoidant' },
      { id: 'eh3a', label: 'Talk it through calmly when ready', value: 'secure' },
    ],
  },
  {
    id: 'eh4',
    text: 'My biggest fear in relationships is:',
    type: 'single-choice',
    category: 'emotionalHealth',
    required: true,
    options: [
      { id: 'eh4c', label: 'Losing independence or being controlled', value: 'avoidant' },
      { id: 'eh4b', label: 'Being abandoned or not being enough', value: 'anxious' },
      { id: 'eh4d', label: 'Both being abandoned and being too close', value: 'disorganized' },
      { id: 'eh4a', label: "I don't have a dominant fear", value: 'secure' },
    ],
  },
  {
    id: 'eh5',
    text: 'When starting a new relationship, I:',
    type: 'single-choice',
    category: 'emotionalHealth',
    required: true,
    options: [
      { id: 'eh5d', label: 'Feel excited but also scared', value: 'disorganized' },
      { id: 'eh5c', label: 'Keep my guard up until sure', value: 'avoidant' },
      { id: 'eh5a', label: 'Feel excited and open', value: 'secure' },
      { id: 'eh5b', label: 'Get invested quickly, think about the future early', value: 'anxious' },
    ],
  },
];

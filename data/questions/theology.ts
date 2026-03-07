import { Question } from '../../types';

export const THEOLOGY_QUESTIONS: Question[] = [
  {
    id: 'theo1',
    text: 'Do you affirm Spirit baptism as distinct from water baptism?',
    type: 'single-choice',
    category: 'theology',
    required: true,
    options: [
      { id: 'theo1a', label: 'Yes', value: 'yes' },
      { id: 'theo1b', label: 'No', value: 'no' },
      { id: 'theo1c', label: 'Not sure', value: 'not-sure' },
    ],
  },
  {
    id: 'theo2',
    text: 'Do you believe speaking in tongues is for today?',
    type: 'single-choice',
    category: 'theology',
    required: true,
    options: [
      { id: 'theo2a', label: 'Yes', value: 'yes' },
      { id: 'theo2b', label: 'No', value: 'no' },
      { id: 'theo2c', label: 'Not sure', value: 'not-sure' },
    ],
  },
  {
    id: 'theo3',
    text: 'Is prophecy a normal part of your worship experience?',
    type: 'single-choice',
    category: 'theology',
    required: true,
    options: [
      { id: 'theo3a', label: 'Yes', value: 'yes' },
      { id: 'theo3b', label: 'Sometimes', value: 'sometimes' },
      { id: 'theo3c', label: 'No', value: 'no' },
    ],
  },
  {
    id: 'theo4',
    text: 'Which gifts of the Spirit do you most often witness? (Select all that apply)',
    type: 'multi-choice',
    category: 'theology',
    required: true,
    options: [
      { id: 'theo4a', label: 'Tongues', value: 'tongues' },
      { id: 'theo4b', label: 'Prophecy', value: 'prophecy' },
      { id: 'theo4c', label: 'Healing', value: 'healing' },
      { id: 'theo4d', label: 'Word of Wisdom', value: 'word-of-wisdom' },
      { id: 'theo4e', label: 'Word of Knowledge', value: 'word-of-knowledge' },
      { id: 'theo4f', label: 'Faith', value: 'faith' },
      { id: 'theo4g', label: 'Discernment of Spirits', value: 'discernment' },
      { id: 'theo4h', label: 'Interpretation of Tongues', value: 'interpretation' },
    ],
  },
  {
    id: 'theo5',
    text: 'How often do you participate in altar calls?',
    type: 'single-choice',
    category: 'theology',
    required: true,
    options: [
      { id: 'theo5b', label: 'Monthly', value: 'monthly' },
      { id: 'theo5a', label: 'Weekly', value: 'weekly' },
      { id: 'theo5d', label: 'Never', value: 'never' },
      { id: 'theo5c', label: 'Rarely', value: 'rarely' },
    ],
  },
  {
    id: 'theo6',
    text: 'Does your church practice laying on of hands for prayer?',
    type: 'single-choice',
    category: 'theology',
    required: true,
    options: [
      { id: 'theo6a', label: 'Yes', value: 'yes' },
      { id: 'theo6b', label: 'No', value: 'no' },
      { id: 'theo6c', label: 'Not sure', value: 'not-sure' },
    ],
  },
];

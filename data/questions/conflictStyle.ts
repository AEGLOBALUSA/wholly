import { Question } from '../../types';

export const CONFLICT_STYLE_QUESTIONS: Question[] = [
  {
    id: 'cs1',
    text: "When there's a disagreement, my first instinct is to:",
    type: 'single-choice',
    category: 'conflictStyle',
    required: true,
    options: [
      { id: 'cs1e', label: 'Find middle ground quickly', value: 'compromising' },
      { id: 'cs1c', label: 'Avoid the topic until things cool down', value: 'avoiding' },
      { id: 'cs1a', label: 'Address directly and work toward a solution', value: 'collaborative' },
      { id: 'cs1d', label: 'Stand my ground until heard', value: 'competing' },
      { id: 'cs1b', label: 'Give in to keep the peace', value: 'accommodating' },
    ],
  },
  {
    id: 'cs2',
    text: "During an argument, I'm most likely to:",
    type: 'single-choice',
    category: 'conflictStyle',
    required: true,
    options: [
      { id: 'cs2d', label: 'Raise my voice or become defensive', value: 'competing' },
      { id: 'cs2e', label: 'Suggest we both give a little', value: 'compromising' },
      { id: 'cs2b', label: "Prioritize my partner's feelings over mine", value: 'accommodating' },
      { id: 'cs2a', label: 'Listen carefully, share my perspective calmly', value: 'collaborative' },
      { id: 'cs2c', label: 'Shut down or leave the room', value: 'avoiding' },
    ],
  },
  {
    id: 'cs3',
    text: 'After conflict is resolved, I:',
    type: 'single-choice',
    category: 'conflictStyle',
    required: true,
    options: [
      { id: 'cs3c', label: 'Try to forget and move on', value: 'avoiding' },
      { id: 'cs3a', label: 'Feel closer for working through it', value: 'collaborative' },
      { id: 'cs3d', label: 'Feel satisfied if my point was understood', value: 'competing' },
      { id: 'cs3e', label: 'Feel okay but like neither got what we wanted', value: 'compromising' },
      { id: 'cs3b', label: 'Feel relieved but sometimes resentful', value: 'accommodating' },
    ],
  },
  {
    id: 'cs4',
    text: 'I believe healthy conflict in a relationship:',
    type: 'single-choice',
    category: 'conflictStyle',
    required: true,
    options: [
      { id: 'cs4b', label: 'Should be minimized for harmony', value: 'accommodating' },
      { id: 'cs4d', label: 'Is necessary for boundaries and respect', value: 'competing' },
      { id: 'cs4e', label: 'Requires both to sacrifice equally', value: 'compromising' },
      { id: 'cs4c', label: 'Is uncomfortable and best avoided', value: 'avoiding' },
      { id: 'cs4a', label: 'Leads to deeper understanding', value: 'collaborative' },
    ],
  },
];

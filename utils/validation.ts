import { OnboardingState, OnboardingAnswers, BasicInfo } from '../types';

/**
 * Validate step 1: Basic Information
 * Required: firstName, age >= 18
 */
export function validateStep1(basicInfo: BasicInfo): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!basicInfo.firstName || basicInfo.firstName.trim() === '') {
    errors.push('First name is required');
  }

  if (!basicInfo.age || basicInfo.age.trim() === '') {
    errors.push('Age is required');
  } else if (parseInt(basicInfo.age, 10) < 18) {
    errors.push('You must be at least 18 years old');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 2: City and Denomination
 * Required: city, denomination
 */
export function validateStep2(basicInfo: BasicInfo): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!basicInfo.city || basicInfo.city.trim() === '') {
    errors.push('City is required');
  }

  if (!basicInfo.denomination || basicInfo.denomination.trim() === '') {
    errors.push('Denomination is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 3: Jargon Terms
 * Required: at least 3 jargon terms selected
 */
export function validateStep3(selectedJargon: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!selectedJargon || selectedJargon.length < 3) {
    errors.push('Please select at least 3 jargon terms');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 4: Theology Questions
 * Required: all 7 theology questions answered
 */
export function validateStep4(theology: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = ['theo1', 'theo2', 'theo3', 'theo4', 'theo5', 'theo6', 'theo7'];

  for (const id of requiredIds) {
    if (!theology[id] || theology[id].trim() === '') {
      errors.push(`Question ${id} must be answered`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 5: Faith Style Pairs
 * Required: all 12 faith style pairs selected
 */
export function validateStep5(faithStyle: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = [
    'fs1', 'fs2', 'fs3', 'fs4', 'fs5', 'fs6',
    'fs7', 'fs8', 'fs9', 'fs10', 'fs11', 'fs12',
  ];

  for (const id of requiredIds) {
    if (!faithStyle[id] || faithStyle[id].trim() === '') {
      errors.push(`Pair ${id} must be selected`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 6: Honesty Check Pairs
 * Required: all 5 honesty check pairs selected
 */
export function validateStep6(honestyCheck: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = ['hc1', 'hc2', 'hc3', 'hc4', 'hc5'];

  for (const id of requiredIds) {
    if (!honestyCheck[id] || honestyCheck[id].trim() === '') {
      errors.push(`Pair ${id} must be selected`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 7: Short Answers
 * Required: all 3 short answers provided (min 10 characters each)
 */
export function validateStep7(shortAnswers: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = ['sa1', 'sa2', 'sa3'];

  for (const id of requiredIds) {
    const answer = shortAnswers[id];
    if (!answer || answer.trim().length < 10) {
      errors.push(`Answer ${id} must be at least 10 characters`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 8: Emotional Health Questions
 * Required: all 8 emotional health questions answered
 */
export function validateStep8(emotionalHealth: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = ['eh1', 'eh2', 'eh3', 'eh4', 'eh5', 'eh6', 'eh7', 'eh8'];

  for (const id of requiredIds) {
    if (!emotionalHealth[id] || emotionalHealth[id].trim() === '') {
      errors.push(`Question ${id} must be answered`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 9: Conflict Style Questions
 * Required: all 4 conflict style questions answered
 */
export function validateStep9(conflictStyle: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = ['cs1', 'cs2', 'cs3', 'cs4'];

  for (const id of requiredIds) {
    if (!conflictStyle[id] || conflictStyle[id].trim() === '') {
      errors.push(`Question ${id} must be answered`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 10: Intellectual Questions
 * Required: all 7 intellectual questions answered
 */
export function validateStep10(intellectual: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = ['int1', 'int2', 'int3', 'int4', 'int5', 'int6', 'int7'];

  for (const id of requiredIds) {
    if (!intellectual[id] || intellectual[id].trim() === '') {
      errors.push(`Question ${id} must be answered`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate step 11: Life Vision Questions
 * Required: all 12 life vision questions answered
 */
export function validateStep11(lifeVision: Record<string, string>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredIds = [
    'lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'lv6',
    'lv7', 'lv8', 'lv9', 'lv10', 'lv11', 'lv12',
  ];

  for (const id of requiredIds) {
    if (!lifeVision[id] || lifeVision[id].trim() === '') {
      errors.push(`Question ${id} must be answered`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate current step based on step number
 */
export function validateCurrentStep(state: OnboardingState): { valid: boolean; errors: string[] } {
  const { currentStep, covenantAccepted, answers } = state;

  // Step 0: Covenant
  if (currentStep === 0) {
    if (!covenantAccepted) {
      return { valid: false, errors: ['You must accept the covenant to continue'] };
    }
    return { valid: true, errors: [] };
  }

  // Step 1: Basic Info
  if (currentStep === 1) {
    return validateStep1(answers.basicInfo);
  }

  // Step 2: City and Denomination
  if (currentStep === 2) {
    return validateStep2(answers.basicInfo);
  }

  // Step 3: Jargon
  if (currentStep === 3) {
    return validateStep3(answers.jargon);
  }

  // Step 4: Theology
  if (currentStep === 4) {
    return validateStep4(answers.theology);
  }

  // Step 5: Faith Style
  if (currentStep === 5) {
    return validateStep5(answers.faithStyle);
  }

  // Step 6: Honesty Check
  if (currentStep === 6) {
    return validateStep6(answers.honesty);
  }

  // Step 7: Short Answers
  if (currentStep === 7) {
    return validateStep7(answers.shortAnswers);
  }

  // Step 8: Emotional Health
  if (currentStep === 8) {
    return validateStep8(answers.emotional);
  }

  // Step 9: Conflict Style
  if (currentStep === 9) {
    return validateStep9(answers.conflict);
  }

  // Step 10: Intellectual
  if (currentStep === 10) {
    return validateStep10(answers.intellectual);
  }

  // Step 11: Life Vision
  if (currentStep === 11) {
    return validateStep11(answers.lifeVision);
  }

  return { valid: true, errors: [] };
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState } from '../types';

const STORAGE_KEY = 'wholly_onboarding';

/**
 * Save onboarding progress to AsyncStorage
 */
export async function saveProgress(state: OnboardingState): Promise<void> {
  try {
    const jsonState = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, jsonState);
  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    throw error;
  }
}

/**
 * Load onboarding progress from AsyncStorage
 * Returns null if no progress has been saved
 */
export async function loadProgress(): Promise<OnboardingState | null> {
  try {
    const jsonState = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonState === null) {
      return null;
    }
    return JSON.parse(jsonState) as OnboardingState;
  } catch (error) {
    console.error('Error loading onboarding progress:', error);
    throw error;
  }
}

/**
 * Clear onboarding progress from AsyncStorage
 */
export async function clearProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing onboarding progress:', error);
    throw error;
  }
}

/**
 * Get default/empty onboarding state
 */
export function getDefaultOnboardingState(): OnboardingState {
  return {
    currentStep: 0,
    covenantAccepted: false,
    answers: {
      covenant: [],
      basicInfo: {
        firstName: '',
        age: '',
        city: '',
        denomination: '',
        photoUrl: '',
      },
      jargon: [],
      theology: {},
      faithStyle: {},
      honesty: {},
      shortAnswers: {},
      emotional: {},
      conflict: {},
      intellectual: {},
      lifeVision: {},
    },
    isComplete: false,
  };
}

/**
 * Update onboarding state by merging with existing saved state
 */
export async function updateProgress(updates: Partial<OnboardingState>): Promise<OnboardingState> {
  try {
    const current = await loadProgress();
    const merged = {
      ...(current || getDefaultOnboardingState()),
      ...updates,
    };
    await saveProgress(merged);
    return merged;
  } catch (error) {
    console.error('Error updating onboarding progress:', error);
    throw error;
  }
}

/**
 * Migrate old storage format if needed (for future updates)
 */
export async function migrateStorage(): Promise<void> {
  try {
    const current = await loadProgress();
    if (current && !('answers' in current)) {
      // Perform migration logic here for future versions
      // For now, this is a placeholder
    }
  } catch (error) {
    console.error('Error migrating storage:', error);
    // Don't throw - migration errors shouldn't break the app
  }
}

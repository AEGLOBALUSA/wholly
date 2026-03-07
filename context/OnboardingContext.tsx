import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState, OnboardingAnswers, BasicInfo } from '../types';
import { saveOnboardingAnswers, completeOnboarding, createProfile } from '../services/profiles';

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateAnswer: (section: string, key: string, value: any) => void;
  isStepValid: (stepNumber: number) => boolean;
  finishOnboarding: (authId?: string, email?: string) => Promise<void>;
}

type OnboardingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_COVENANT'; payload: string[] }
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<BasicInfo> }
  | { type: 'UPDATE_JARGON'; payload: string[] }
  | { type: 'UPDATE_THEOLOGY'; payload: Record<string, string> }
  | { type: 'UPDATE_FAITH_STYLE'; payload: Record<string, string> }
  | { type: 'UPDATE_HONESTY'; payload: Record<string, string> }
  | { type: 'UPDATE_SHORT_ANSWERS'; payload: Record<string, string> }
  | { type: 'UPDATE_EMOTIONAL'; payload: Record<string, string> }
  | { type: 'UPDATE_CONFLICT'; payload: Record<string, string> }
  | { type: 'UPDATE_INTELLECTUAL'; payload: Record<string, string> }
  | { type: 'UPDATE_LIFE_VISION'; payload: Record<string, string> }
  | { type: 'SET_COMPLETE'; payload: boolean }
  | { type: 'SET_PROFILE_ID'; payload: string }
  | { type: 'RESET' };

// Extended state to include Supabase profile ID
interface ExtendedOnboardingState extends OnboardingState {
  profileId: string | null;
}

const initialState: ExtendedOnboardingState = {
  currentStep: 0,
  covenantAccepted: false,
  isComplete: false,
  profileId: null,
  answers: {
    covenant: [],
    basicInfo: {
      firstName: '',
      age: '',
      city: '',
      denomination: '',
      gender: '',
      interestedIn: '',
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
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

function onboardingReducer(
  state: ExtendedOnboardingState,
  action: OnboardingAction,
): ExtendedOnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_COVENANT':
      return {
        ...state,
        answers: { ...state.answers, covenant: action.payload },
      };
    case 'UPDATE_BASIC_INFO':
      return {
        ...state,
        answers: {
          ...state.answers,
          basicInfo: { ...state.answers.basicInfo, ...action.payload },
        },
      };
    case 'UPDATE_JARGON':
      return {
        ...state,
        answers: { ...state.answers, jargon: action.payload },
      };
    case 'UPDATE_THEOLOGY':
      return {
        ...state,
        answers: { ...state.answers, theology: action.payload },
      };
    case 'UPDATE_FAITH_STYLE':
      return {
        ...state,
        answers: { ...state.answers, faithStyle: action.payload },
      };
    case 'UPDATE_HONESTY':
      return {
        ...state,
        answers: { ...state.answers, honesty: action.payload },
      };
    case 'UPDATE_SHORT_ANSWERS':
      return {
        ...state,
        answers: { ...state.answers, shortAnswers: action.payload },
      };
    case 'UPDATE_EMOTIONAL':
      return {
        ...state,
        answers: { ...state.answers, emotional: action.payload },
      };
    case 'UPDATE_CONFLICT':
      return {
        ...state,
        answers: { ...state.answers, conflict: action.payload },
      };
    case 'UPDATE_INTELLECTUAL':
      return {
        ...state,
        answers: { ...state.answers, intellectual: action.payload },
      };
    case 'UPDATE_LIFE_VISION':
      return {
        ...state,
        answers: { ...state.answers, lifeVision: action.payload },
      };
    case 'SET_COMPLETE':
      return { ...state, isComplete: action.payload };
    case 'SET_PROFILE_ID':
      return { ...state, profileId: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Map step numbers to section names for Supabase persistence
const STEP_SECTIONS: Record<number, string> = {
  0: 'covenant',
  1: 'basicInfo',
  2: 'jargon',
  3: 'theology',
  4: 'faithStyle',
  5: 'honesty',
  6: 'shortAnswers',
  7: 'emotional',
  8: 'conflict',
  9: 'intellectual',
  10: 'lifeVision',
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem('onboardingState');
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'SET_STEP', payload: parsed.currentStep });
          dispatch({ type: 'SET_COVENANT', payload: parsed.answers.covenant });
          dispatch({
            type: 'UPDATE_BASIC_INFO',
            payload: parsed.answers.basicInfo,
          });
          dispatch({ type: 'UPDATE_JARGON', payload: parsed.answers.jargon });
          dispatch({ type: 'UPDATE_THEOLOGY', payload: parsed.answers.theology });
          dispatch({ type: 'UPDATE_FAITH_STYLE', payload: parsed.answers.faithStyle });
          dispatch({ type: 'UPDATE_HONESTY', payload: parsed.answers.honesty });
          dispatch({ type: 'UPDATE_SHORT_ANSWERS', payload: parsed.answers.shortAnswers });
          dispatch({ type: 'UPDATE_EMOTIONAL', payload: parsed.answers.emotional });
          dispatch({ type: 'UPDATE_CONFLICT', payload: parsed.answers.conflict });
          dispatch({ type: 'UPDATE_INTELLECTUAL', payload: parsed.answers.intellectual });
          dispatch({ type: 'UPDATE_LIFE_VISION', payload: parsed.answers.lifeVision });
          dispatch({ type: 'SET_COMPLETE', payload: parsed.isComplete });
          if (parsed.profileId) {
            dispatch({ type: 'SET_PROFILE_ID', payload: parsed.profileId });
          }
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
      }
    };

    loadState();
  }, []);

  // Save to AsyncStorage on every change
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('onboardingState', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save onboarding state:', error);
      }
    };

    saveState();
  }, [state]);

  // Persist section answers to Supabase when step changes
  useEffect(() => {
    if (state.profileId && state.currentStep > 0) {
      const prevStep = state.currentStep - 1;
      const section = STEP_SECTIONS[prevStep];
      if (section) {
        const answers = state.answers[section as keyof OnboardingAnswers];
        if (answers && (Array.isArray(answers) ? answers.length > 0 : Object.keys(answers).length > 0)) {
          saveOnboardingAnswers(state.profileId, section, answers as any);
        }
      }
    }
  }, [state.currentStep, state.profileId]);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const updateAnswer = useCallback(
    (section: string, key: string, value: any) => {
      const current = state.answers[section as keyof OnboardingAnswers];
      if (typeof current === 'object' && !Array.isArray(current)) {
        const updated = { ...current, [key]: value };
        dispatch({
          type: `UPDATE_${section.toUpperCase()}` as any,
          payload: updated,
        });
      }
    },
    [state.answers],
  );

  const isStepValid = useCallback((stepNumber: number): boolean => {
    const { answers } = state;
    switch (stepNumber) {
      case 0: return answers.covenant.length > 0;
      case 1:
        return (
          answers.basicInfo.firstName.trim().length > 0 &&
          answers.basicInfo.age.trim().length > 0 &&
          answers.basicInfo.city.trim().length > 0 &&
          answers.basicInfo.denomination.trim().length > 0
        );
      case 2: return answers.jargon.length >= 3;
      case 3: return Object.keys(answers.theology).length >= 6;       // 6 theology questions
      case 4: return Object.keys(answers.faithStyle).length >= 12;    // 12 forced-choice pairs
      case 5: return Object.keys(answers.honesty).length >= 3;       // 3 honesty check pairs
      case 6: return Object.keys(answers.shortAnswers).length >= 3;  // 3 short answer questions
      case 7: return Object.keys(answers.emotional).length >= 5;     // 5 emotional health questions
      case 8: return Object.keys(answers.conflict).length >= 4;      // 4 conflict style questions
      case 9: return Object.keys(answers.intellectual).length >= 7;   // 7 intellectual questions
      case 10: return Object.keys(answers.lifeVision).length >= 8;   // 8 life vision questions
      default: return false;
    }
  }, [state.answers]);

  /**
   * Call this when onboarding is complete.
   * Creates/updates the Supabase profile and triggers match calculation.
   */
  const finishOnboarding = useCallback(async (authId?: string, email?: string) => {
    dispatch({ type: 'SET_COMPLETE', payload: true });

    if (authId && email) {
      // Create profile in Supabase
      const profile = await createProfile(authId, email, state.answers.basicInfo);
      if (profile) {
        dispatch({ type: 'SET_PROFILE_ID', payload: profile.id });

        // Save all answer sections
        const sections = Object.keys(STEP_SECTIONS).map(k => STEP_SECTIONS[parseInt(k)]);
        for (const section of sections) {
          const answers = state.answers[section as keyof OnboardingAnswers];
          if (answers) {
            await saveOnboardingAnswers(profile.id, section, answers as any);
          }
        }

        // Trigger match calculation
        await completeOnboarding(profile.id);
      }
    }
  }, [state.answers]);

  const value: OnboardingContextType = {
    state,
    dispatch,
    goToStep,
    nextStep,
    prevStep,
    updateAnswer,
    isStepValid,
    finishOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

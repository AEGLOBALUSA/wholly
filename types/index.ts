// Question types
export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'single-choice' | 'multi-choice' | 'forced-choice' | 'text' | 'number';
  options?: QuestionOption[];
  required?: boolean;
  category?: string;
}

export interface ForcedChoicePair {
  id: string;
  optionA: { label: string; value: string };
  optionB: { label: string; value: string };
}

export interface JargonTerm {
  id: string;
  term: string;
  isAuthentic: boolean;
}

export interface CovenantStatement {
  id: string;
  text: string;
}

// Onboarding state
export interface BasicInfo {
  firstName: string;
  age: string;
  city: string;
  denomination: string;
  gender: string;
  interestedIn: string;
  photoUrl?: string;
}

export interface OnboardingAnswers {
  basicInfo: BasicInfo;
  covenant: string[];
  jargon: string[];
  theology: Record<string, string>;
  faithStyle: Record<string, string>;
  honesty: Record<string, string>;
  shortAnswers: Record<string, string>;
  emotional: Record<string, string>;
  conflict: Record<string, string>;
  intellectual: Record<string, string>;
  lifeVision: Record<string, string>;
}

export interface OnboardingState {
  currentStep: number;
  covenantAccepted: boolean;
  answers: OnboardingAnswers;
  isComplete: boolean;
}

// Pastoral Verification
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'declined';

export type PastoralDepartment =
  | 'senior-pastor'
  | 'youth'
  | 'young-adults'
  | 'kids'
  | 'worship'
  | 'connect-groups'
  | 'campus-pastor'
  | 'other';

export interface PastoralVerification {
  id: string;
  userId: string;
  status: VerificationStatus;
  department: PastoralDepartment;
  pastorName: string;
  pastorEmail: string;
  churchName: string;
  requestedAt: string;
  verifiedAt?: string;
  declinedAt?: string;
  declineReason?: string;
}

// Matching
export interface CompatibilityScores {
  spiritual: number;
  emotional: number;
  intellectual: number;
  lifeVision: number;
  overall: number;
}

export type MatchTier = 'exceptional' | 'strong' | 'compatible' | 'below';

export interface DemoProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  denomination: string;
  gender: 'male' | 'female';
  bio: string;
  scores: CompatibilityScores;
  tier: MatchTier;
  overallScore: number;
  pastoralVerified?: boolean;
  pastoralDepartment?: PastoralDepartment;
}

export const COLORS = {
  background: '#FFFAF7',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#5C5C5C',
  textMuted: '#9CA3AF',
  primary: '#D4726A',
  primaryLight: '#F0B8B3',
  primarySubtle: '#FFF0EE',
  secondary: '#F5EBE7',
  border: '#E8E0DC',
  borderLight: '#F0EAE6',
  gold: '#D4A853',
  green: '#4CAF7D',
  error: '#E25050',
  white: '#FFFFFF',
  charcoal: '#1A1A1A',
};

export const FONTS = {
  heading: 'DMSansBold',
  headingMedium: 'DMSansSemiBold',
  body: 'DMSans',
  bodyMedium: 'DMSansMedium',
  bodySemiBold: 'DMSansSemiBold',
  bodyBold: 'DMSansBold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const TIER_COLORS: Record<string, string> = {
  exceptional: '#4CAF7D',
  strong: '#D4A853',
  compatible: '#9CA3AF',
  below: '#E25050',
};

export function getTier(score: number): { tier: string; color: string; label: string } {
  if (score >= 82) return { tier: 'exceptional', color: TIER_COLORS.exceptional, label: 'Exceptional Match' };
  if (score >= 72) return { tier: 'strong', color: TIER_COLORS.strong, label: 'Strong Match' };
  if (score >= 62) return { tier: 'compatible', color: TIER_COLORS.compatible, label: 'Compatible' };
  return { tier: 'below', color: TIER_COLORS.below, label: 'Low Compatibility' };
}

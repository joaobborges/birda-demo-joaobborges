import { colors } from './colors';

/**
 * Border radius — normalized 4px scale
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const buttons = {
  default: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: colors.blue500,
    borderRadius: borderRadius.full,
    borderCurve: 'continuous' as const,
  },
  cta: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.blue500,
    borderRadius: borderRadius.full,
    borderCurve: 'continuous' as const,
  },
  small: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.blue500,
    borderRadius: borderRadius.full,
    borderCurve: 'continuous' as const,
  },
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
export type ButtonVariant = keyof typeof buttons;

import { TextStyle } from 'react-native';

export const fontWeights = {
  light: 'Rubik_300Light',
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semiBold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
} as const;

/** Default font family -- backward compatible alias */
export const fontFamily = fontWeights.regular;

export const typography = {
  displayLarge: {
    fontFamily: fontWeights.light,
    fontSize: 65,
    lineHeight: 78,
  },
  display: {
    fontFamily: fontWeights.light,
    fontSize: 50,
    lineHeight: 60,
  },
  sectionHeading: {
    fontFamily: fontWeights.regular,
    fontSize: 42,
    lineHeight: 50,
  },
  h1: {
    fontFamily: fontWeights.regular,
    fontSize: 34,
    lineHeight: 41,
  },
  h2: {
    fontFamily: fontWeights.regular,
    fontSize: 30,
    lineHeight: 36,
  },
  h3: {
    fontFamily: fontWeights.regular,
    fontSize: 26,
    lineHeight: 31,
  },
  subheading: {
    fontFamily: fontWeights.medium,
    fontSize: 22,
    lineHeight: 31,
  },
  bodyLarge: {
    fontFamily: fontWeights.light,
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontWeights.light,
    fontSize: 17,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fontWeights.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontWeights.regular,
    fontSize: 14,
    lineHeight: 18,
  },
  buttonLabel: {
    fontFamily: fontWeights.regular,
    fontSize: 14,
    lineHeight: 17,
    textTransform: 'uppercase' as TextStyle['textTransform'],
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: fontWeights.semiBold,
    fontSize: 19,
    lineHeight: 22,
  },
  navItem: {
    fontFamily: fontWeights.medium,
    fontSize: 18,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
} as const;

export type TypographyToken = keyof typeof typography;

export { colors, semantic } from './colors';
export type { ColorToken, SemanticToken } from './colors';

export { fontFamily, fontWeights, typography } from './typography';
export type { TypographyToken } from './typography';

export { spacing } from './spacing';
export type { SpacingToken } from './spacing';

export { borderRadius, buttons, containers } from './components';
export type { BorderRadiusToken, ButtonVariant, ContainerVariant } from './components';

export const theme = {
  colors: require('./colors').colors,
  semantic: require('./colors').semantic,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./components').borderRadius,
  buttons: require('./components').buttons,
  containers: require('./components').containers,
} as const;

export default theme;

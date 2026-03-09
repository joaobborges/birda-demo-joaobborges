/**
 * Birda color system
 *
 * Brand scale: blue tints from light background to primary action.
 * Neutral scale: dark-to-light grays for text, borders, and surfaces.
 */

export const colors = {
  // ── Brand ──
  blue50: '#C7E1FF',   // Tinted backgrounds, hero sections, card fills
  blue100: '#A3CEFF',  // Hover states, highlights
  blue500: '#1F87FE',  // Primary actions, links, CTAs

  // ── Accent ──
  accent: '#2DD1E6',   // Teal accent (birda.org brand)
  secondary: '#7265E3', // Purple secondary (birda.org brand)

  // ── Neutral ──
  neutral950: '#000000', // Pure black (button backgrounds)
  neutral900: '#111111', // Highest emphasis text
  neutral800: '#292929', // Labels, strong text
  neutral700: '#2D3142', // Default body text
  neutral650: '#374151', // Strong body text
  neutral500: '#787878', // Muted text, placeholders
  neutral400: '#9CA3AF', // Placeholder text, muted icons
  neutral300: '#D9D9D9', // Borders, dividers
  neutral100: '#F8F8F8', // Input backgrounds, subtle surfaces
  neutral0: '#FFFFFF',   // Page background, cards

  // ── Status ──
  statusError: '#EF4444',     // Error, notification badges
  statusSuccessBg: '#D4EDDA', // Success background

  // ── Rarity ──
  rarityCommonBg: '#DBEAFE',   // Common rarity badge
  rarityUncommonBg: '#FEF3C7', // Uncommon rarity badge
  rarityRareBg: '#FCE7F3',     // Rare rarity badge
} as const;

// ── Semantic tokens ──
export const semantic = {
  textPrimary: colors.neutral700,
  textSecondary: colors.neutral500,
  textStrong: colors.neutral900,
  textInverse: colors.neutral0,
  textMuted: colors.neutral400,
  textBody: colors.neutral650,
  textInput: colors.neutral800,

  bgPage: colors.neutral0,
  bgSurface: colors.neutral100,
  bgTinted: colors.blue50,

  borderDefault: colors.neutral300,
  borderSubtle: colors.neutral100,

  actionPrimary: colors.blue500,
  actionPrimaryHover: colors.blue100,
  actionPrimaryBg: colors.blue50,
  actionSecondary: colors.neutral950,
  actionSecondaryText: colors.neutral0,

  // ── Accent ──
  accent: colors.accent,
  secondary: colors.secondary,

  // ── Status ──
  statusError: colors.statusError,
  statusSuccessBg: colors.statusSuccessBg,

  // ── Rarity ──
  rarityCommonBg: colors.rarityCommonBg,
  rarityUncommonBg: colors.rarityUncommonBg,
  rarityRareBg: colors.rarityRareBg,
} as const;

export type ColorToken = keyof typeof colors;
export type SemanticToken = keyof typeof semantic;

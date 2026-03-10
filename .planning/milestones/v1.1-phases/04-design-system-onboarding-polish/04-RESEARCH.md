# Phase 4: Design System & Onboarding Polish - Research

**Researched:** 2026-03-09
**Domain:** Expo SDK 55 font loading, splash screen, React Native design token enforcement, Reanimated disabled states
**Confidence:** HIGH

## Summary

This phase addresses the most pervasive visual gap in the app: the Rubik font is declared in typography tokens (`fontFamily: 'Rubik'`) but never loaded, so all text silently falls back to San Francisco (iOS system font). Every screen is affected. The fix requires installing `@expo-google-fonts/rubik`, configuring the `expo-font` plugin for build-time embedding, and updating typography tokens to use weight-specific family names (e.g., `Rubik_300Light` instead of generic `Rubik`).

Beyond font loading, the phase requires a systematic sweep of all 19 screen/component files to replace hardcoded `fontSize`, `fontWeight`, padding/margin values, and the one remaining hardcoded hex (`#FFFFFF` in welcome.tsx checkmark) with theme tokens. The Button component needs a `disabled` prop with opacity animation. The OnboardingLayout footer needs consistent `fixedBottomCTA` padding. ProgressDots needs color/position fixes. The splash screen needs Birda logo configuration.

**Primary recommendation:** Start with font installation + app.json config + typography token rewrite (requires EAS rebuild), then sweep all files for token enforcement, then fix onboarding-specific bugs (ProgressDots, disabled button, overflow).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Splash screen: White (#FFFFFF) background with user-provided Birda logo image. Splash stays visible until Rubik fonts are fully loaded (minimum ~500ms). Fade-out transition (~300ms) to first screen -- no white flash. Logo asset will be provided by user and placed in src/assets/
- Disabled button state: Same blue (#1F87FE) color at 40% opacity when disabled, white text in both states. Smooth Reanimated spring fade (~200ms) when transitioning between disabled/enabled. Completely inert when disabled -- no press animation, no haptic feedback. Applies to name input screen CTA (ONBR-07)
- Token enforcement scope: Sweep ALL screens (onboarding, map, profile, community) -- not just onboarding. Replace all hardcoded hex values and font references with theme tokens. When a color isn't in the token system, map to closest existing token (don't add new tokens). Add `fixedBottomCTA` reusable container style to components.ts -- single source of truth for 24px bottom / 16px horizontal padding
- Skip button handling: Remove skip button entirely on name input screen (no replacement text). Audit all other onboarding screens for skip buttons -- decide per-screen which keep/remove
- Font loading: Load Rubik weights 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) -- full range for future flexibility. No italic variants. Load via expo-font at build time (already in dependencies)

### Claude's Discretion
- Exact splash screen fade animation curve and timing fine-tuning
- Progress dots transition animation between screens (colors/position are locked by ONBR-04/05)
- Overflow fix approach for Stay in the Loop and Mailing List screens (ONBR-08/09)
- How to handle the skip button audit results for non-name screens

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUN-05 | App displays splash screen with Birda logo on launch | expo-splash-screen plugin config in app.json; logo asset in assets/; fade transition via SplashScreen API |
| FOUN-06 | All text renders in Rubik typeface (font loaded at build time) | @expo-google-fonts/rubik + expo-font config plugin; typography.ts token rewrite to weight-specific names |
| FOUN-07 | All primary CTA buttons use design system color tokens | Button.tsx uses `semantic.actionSecondary` (black) instead of `semantic.actionPrimary` (blue) -- needs fix; buttons.cta style in components.ts already correct |
| FOUN-08 | All screens use spacing tokens from theme for consistent gaps | Systematic sweep of all 19 files; replace hardcoded numbers with `spacing['X']` references |
| FOUN-09 | All fixed bottom CTA containers use 24px bottom / 16px horizontal padding | Add `fixedBottomCTA` to components.ts; apply in OnboardingLayout footer and any other fixed bottom containers |
| ONBR-04 | Progress dots show white at 50% opacity (inactive) and blue (active) | ProgressDots.tsx inactive uses `semantic.borderDefault` (#D9D9D9) -- change to `rgba(255,255,255,0.5)` or add semantic token |
| ONBR-05 | Progress dots maintain fixed position across all onboarding screens | Currently in OnboardingLayout header slot which varies per screen; need consistent absolute/fixed positioning |
| ONBR-06 | "How should we call you" screen has increased spacing below avatar | name.tsx `avatarPlaceholder` has `marginBottom: 24` -- increase per design |
| ONBR-07 | Name input screen has no skip button; CTA disabled until text entered | Remove Skip button, add `disabled` prop to Button component with opacity animation, wire to text input state |
| ONBR-08 | Stay in the Loop screen content stays within view (overflow bug fix) | reminders.tsx uses ScrollView via OnboardingLayout but content may overflow; needs containment |
| ONBR-09 | Mailing List screen content stays within view (overflow bug fix) | mailing-list.tsx same overflow pattern; toggle row at bottom may push below fold |
| ONBR-10 | All onboarding CTA buttons use primary color with pill shape | Button.tsx primary uses `actionSecondary` (black #111) not `actionPrimary` (blue #1F87FE); borderRadius is 16 not full |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-font | ~55.0.4 | Build-time font embedding via config plugin | Already installed; config plugin approach eliminates runtime loading |
| expo-splash-screen | ~55.0.10 | Native splash screen with fade transition | Already installed and wired in _layout.tsx |
| react-native-reanimated | 4.2.1 | Disabled button opacity animation (spring) | Already used for all animations in the app |

### New Dependency
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @expo-google-fonts/rubik | latest | Rubik TTF font files for build-time embedding | Maintained by Expo team; provides all weight variants; works with expo-font config plugin |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @expo-google-fonts/rubik | Manual TTF download from Google Fonts | Manual download works but @expo-google-fonts provides verified, correctly-named files and is maintained by Expo |
| Build-time font embedding | useFonts runtime hook | Runtime loading requires coordinating with splash screen hide, introduces FOUT risk; build-time is simpler and instant |

**Installation:**
```bash
npx expo install @expo-google-fonts/rubik
```

## Architecture Patterns

### Pattern 1: Build-Time Font Embedding (expo-font config plugin)

**What:** Fonts are embedded into the native binary at build time via `app.json` plugin config. No runtime loading code needed.

**When to use:** EAS builds (not Expo Go). Eliminates FOUT entirely.

**Configuration (app.json):**
```json
[
  "expo-font",
  {
    "fonts": [
      "node_modules/@expo-google-fonts/rubik/300/Rubik_300Light.ttf",
      "node_modules/@expo-google-fonts/rubik/400/Rubik_400Regular.ttf",
      "node_modules/@expo-google-fonts/rubik/500/Rubik_500Medium.ttf",
      "node_modules/@expo-google-fonts/rubik/600/Rubik_600SemiBold.ttf",
      "node_modules/@expo-google-fonts/rubik/700/Rubik_700Bold.ttf"
    ]
  }
]
```

**Typography token update (typography.ts):**
```typescript
// Weight-specific family names (build-time embedded fonts register under file names)
const fontWeights = {
  light: 'Rubik_300Light',
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semiBold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
} as const;

// Each typography token uses the specific weight family
export const typography = {
  displayLarge: {
    fontFamily: fontWeights.light,  // was: fontFamily + fontWeight: '300'
    fontSize: 65,
    lineHeight: 78,
  },
  // ...etc for all 14 tokens
} as const;
```

**Key insight:** With build-time embedding, `fontWeight` in style objects is NOT used to select weight. The weight is encoded in the `fontFamily` name itself. Remove `fontWeight` from typography tokens to avoid confusion -- the correct weight is already baked into the family name.

### Pattern 2: Splash Screen with Logo and Fade

**What:** Native splash screen shows Birda logo on white background, fades out when app is ready.

**Configuration (app.json):**
```json
{
  "splash": {
    "image": "./assets/splash-logo.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  }
}
```

**Existing code already handles hide:** `_layout.tsx` calls `SplashScreen.preventAutoHideAsync()` at module level and `SplashScreen.hideAsync()` after Zustand hydration. With build-time font embedding, fonts are available synchronously -- no additional async gate needed.

**Fade behavior:** expo-splash-screen provides `SplashScreen.hideAsync()` which uses a default fade. The `expo-splash-screen` plugin can configure fade duration. The CONTEXT requests ~300ms fade-out and minimum ~500ms display. This can be achieved by adding a small delay before calling `hideAsync()`.

### Pattern 3: Disabled Button with Reanimated Opacity

**What:** Button receives `disabled` prop; when true, renders at 40% opacity with no press interaction.

```typescript
interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  disabled?: boolean
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const pressed = useSharedValue(0)
  const disabledProgress = useSharedValue(disabled ? 1 : 0)

  // Animate on disabled change
  useEffect(() => {
    disabledProgress.set(withSpring(disabled ? 1 : 0, { duration: 200 }))
  }, [disabled])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(disabledProgress.get(), [0, 1], [1, 0.4]),
    transform: [
      { scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) },
    ],
  }))

  // When disabled: no gesture handler attached
  const tap = Gesture.Tap()
    .enabled(!disabled)  // Gesture.Tap().enabled() controls activation
    .onBegin(() => { pressed.set(withTiming(1, { duration: 100 })) })
    .onFinalize(() => { pressed.set(withTiming(0, { duration: 200 })) })
    .onEnd(() => { runOnJS(handlePress)() })
  // ...
}
```

### Pattern 4: fixedBottomCTA Container Style

**What:** Reusable style added to `components.ts` for consistent bottom CTA containers.

```typescript
// In components.ts
export const containers = {
  fixedBottomCTA: {
    paddingBottom: 24,  // spacing['6']
    paddingHorizontal: 16,  // spacing['4']
    gap: 8,  // spacing['2']
  },
} as const;
```

**Apply in OnboardingLayout.tsx footer:**
```typescript
// Replace current footer style (paddingHorizontal: 24, paddingBottom: bottom + 20)
// With: containers.fixedBottomCTA + safe area bottom inset
<View style={[containers.fixedBottomCTA, { paddingBottom: bottom + containers.fixedBottomCTA.paddingBottom }]}>
```

### Anti-Patterns to Avoid
- **Hardcoded fontSize/fontWeight in screen files:** Use typography tokens (`typography.h2`, `typography.body`, etc.) instead of inline `fontSize: 24, fontWeight: '700'`
- **Bare `fontFamily: 'Rubik'`:** Must use weight-specific name like `Rubik_400Regular`; bare `Rubik` will not resolve to any loaded font
- **Using `fontWeight` with build-time fonts:** Weight is encoded in family name; setting both causes unpredictable behavior on Android
- **Adding `widgetSpacing` export:** The theme index re-exports `widgetSpacing` from spacing.ts but it does not exist -- this will cause a runtime error if imported. Either add it or remove the re-export

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading | Custom asset loader | expo-font config plugin (build-time) | Handles native asset registration, cache invalidation, platform differences |
| Splash screen fade | Custom animated overlay | expo-splash-screen API | Native implementation prevents white flash; JS overlay would flash |
| Button press animation | Custom Animated.Value | Existing Gesture.Tap + Reanimated pattern | Already established in Button.tsx; just add disabled guard |

## Common Pitfalls

### Pitfall 1: Font Name Mismatch After Build-Time Embedding
**What goes wrong:** Build-time embedded fonts register under their TTF file names (e.g., `Rubik_300Light`), not under a generic family name (`Rubik`). If typography tokens still reference `fontFamily: 'Rubik'`, text silently falls back to system font -- no error thrown.
**Why it happens:** The expo-font config plugin uses file names as registered font names. This differs from web CSS where you define `font-family` in `@font-face`.
**How to avoid:** After installing `@expo-google-fonts/rubik`, verify the exact TTF file names in `node_modules/@expo-google-fonts/rubik/*/`. Update ALL typography tokens to use the exact registered names.
**Warning signs:** Text still looks like San Francisco after EAS rebuild. Test by comparing font metrics (Rubik has notably different letter spacing than SF Pro).

### Pitfall 2: Missing fontWeight Removal
**What goes wrong:** Typography tokens include both `fontFamily: 'Rubik_700Bold'` and `fontWeight: '700'`. On iOS this works (iOS ignores conflicting fontWeight), but on Android it can cause the font to not load or render incorrectly.
**Why it happens:** The existing tokens use fontFamily + fontWeight pattern (designed for generic family names). When switching to weight-specific names, developers forget to remove fontWeight.
**How to avoid:** When rewriting typography.ts, systematically remove `fontWeight` from every token. The weight is already encoded in the family name.

### Pitfall 3: Button Color Mismatch (FOUN-07/ONBR-10)
**What goes wrong:** The Button component's `primary` variant currently uses `semantic.actionSecondary` (#111111 black), NOT `semantic.actionPrimary` (#1F87FE blue). The theme's `buttons.default` style correctly uses `colors.blue500`, but Button.tsx does not reference the theme button styles at all.
**Why it happens:** The Button component was built with its own inline StyleSheet that doesn't reference the theme button variants in `components.ts`.
**How to avoid:** Rewrite Button.tsx to derive styles from `buttons` and `containers` in `components.ts`. Primary variant = `buttons.cta` or `buttons.default` styles.

### Pitfall 4: OnboardingLayout Footer Padding Inconsistency (FOUN-09)
**What goes wrong:** The OnboardingLayout footer currently uses `paddingHorizontal: 24` and `paddingBottom: bottom + 20`. The requirement is 24px bottom / 16px horizontal. These are different values than what's currently coded.
**Why it happens:** The layout was built before the design spec was finalized.
**How to avoid:** Use the `fixedBottomCTA` container style from components.ts. Verify the values: 24px bottom (from safe area edge), 16px horizontal padding.

### Pitfall 5: ProgressDots Color Context
**What goes wrong:** ONBR-04 specifies "white at 50% opacity (inactive)" for dots. This implies the dots are rendered on a dark/colored background. If dots are on a white background, white-at-50%-opacity would be invisible.
**Why it happens:** The design assumes a specific background context for the progress dots.
**How to avoid:** Verify the onboarding screens' background where ProgressDots appear. If backgrounds are white (#FFFFFF), the "white at 50% opacity" requirement likely means dots should use a semi-transparent approach appropriate for the actual background. Check the original Birda app design for reference.

### Pitfall 6: widgetSpacing Export Error
**What goes wrong:** `src/theme/index.ts` re-exports `widgetSpacing` from `./spacing`, but `spacing.ts` does not export any `widgetSpacing`. This will throw a runtime error if any file imports `widgetSpacing` from the theme barrel.
**How to avoid:** Either add `widgetSpacing` to spacing.ts or remove it from index.ts. Check if any files import it.

## Code Examples

### Typography Token Rewrite Pattern
```typescript
// src/theme/typography.ts -- AFTER font loading setup

import { TextStyle } from 'react-native';

// Weight-specific family names matching @expo-google-fonts/rubik TTF files
const fontWeights = {
  light: 'Rubik_300Light',
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semiBold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
} as const;

export const fontFamily = fontWeights.regular; // default

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
  h1: {
    fontFamily: fontWeights.regular,
    fontSize: 34,
    lineHeight: 41,
  },
  body: {
    fontFamily: fontWeights.light,
    fontSize: 17,
    lineHeight: 24,
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
  // ... all 14 tokens updated similarly
} as const;
```

### Screen File Token Sweep Pattern
```typescript
// BEFORE (hardcoded in screen files)
heading: {
  fontSize: 24,
  fontWeight: '700',
  color: semantic.textPrimary,
  textAlign: 'center',
},

// AFTER (using typography tokens)
heading: {
  ...typography.h3,  // or closest matching token
  color: semantic.textPrimary,
  textAlign: 'center',
},
```

### Hardcoded Hex Replacement
```typescript
// BEFORE (profile.tsx)
{ icon: 'sunny-outline', label: 'Early Bird', bg: '#FEF3C7' },  // hardcoded

// AFTER (using existing semantic tokens)
{ icon: 'sunny-outline', label: 'Early Bird', bg: semantic.rarityUncommonBg },  // #FEF3C7 = rarityUncommonBg
```

### ProgressDots Color Fix
```typescript
// BEFORE
inactive: {
  backgroundColor: semantic.borderDefault,  // #D9D9D9
},

// AFTER (ONBR-04 requirement)
inactive: {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',  // white at 50% opacity
},
active: {
  backgroundColor: semantic.actionPrimary,  // #1F87FE blue (already correct)
  width: 24,
},
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFonts` runtime hook | expo-font config plugin (build-time) | Expo SDK 50+ | No FOUT, no async loading, simpler code |
| `fontFamily: 'Rubik'` + `fontWeight: '700'` | `fontFamily: 'Rubik_700Bold'` (no fontWeight) | Build-time embedding | Weight encoded in family name; fontWeight ignored/conflicting |
| `SplashScreen.hide()` | `SplashScreen.hideAsync()` | Expo SDK 50+ | Returns promise; async-safe |

## Open Questions

1. **@expo-google-fonts/rubik directory structure**
   - What we know: Prior research says paths like `node_modules/@expo-google-fonts/rubik/300/Rubik_300Light.ttf`
   - What's unclear: Exact paths need verification after `npx expo install`. The package structure may have changed.
   - Recommendation: After installing, verify with `ls node_modules/@expo-google-fonts/rubik/` and adjust app.json paths accordingly.

2. **ProgressDots background context for ONBR-04**
   - What we know: Requirement says "white at 50% opacity (inactive)". This makes sense on dark/colored backgrounds.
   - What's unclear: Some onboarding screens have white backgrounds, where white dots would be invisible.
   - Recommendation: Implement as specified. If dots appear on white backgrounds, this signals the background should change in a later phase, or the dots need a different inactive color for light backgrounds.

3. **Splash screen logo asset**
   - What we know: User will provide a Birda logo image for the splash screen.
   - What's unclear: Whether the asset exists yet in src/assets/.
   - Recommendation: Plan should include a task that uses a placeholder if the logo is not yet provided, with clear instructions for swapping.

4. **EAS rebuild required**
   - What we know: Changing expo-font plugin config and splash screen image are native changes that require an EAS rebuild (not just a JS bundle update).
   - What's unclear: Whether the user has EAS configured and ready.
   - Recommendation: Batch all native config changes (font embedding + splash screen) into a single wave/plan to minimize rebuilds.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual visual verification (no automated UI test framework installed) |
| Config file | none |
| Quick run command | `npx expo start` (visual check in dev build) |
| Full suite command | `npx expo run:ios` (production build for splash/font verification) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-05 | Splash screen shows Birda logo | manual-only | Visual check on production build | N/A |
| FOUN-06 | All text in Rubik | manual-only | Visual comparison after EAS rebuild | N/A |
| FOUN-07 | CTA buttons use blue (#1F87FE) | manual-only | Visual check across all screens | N/A |
| FOUN-08 | Spacing tokens used everywhere | smoke | `npx expo lint` (catches hardcoded values if lint rule added) | N/A |
| FOUN-09 | Fixed bottom CTA consistent padding | manual-only | Visual measurement across screens | N/A |
| ONBR-04 | Progress dots colors correct | manual-only | Visual check on onboarding flow | N/A |
| ONBR-05 | Progress dots fixed position | manual-only | Navigate through onboarding screens, dots don't shift | N/A |
| ONBR-06 | Increased spacing below avatar | manual-only | Visual check on name screen | N/A |
| ONBR-07 | No skip, disabled CTA until text entered | smoke | Launch app, navigate to name screen, verify button state | N/A |
| ONBR-08 | Stay in the Loop no overflow | manual-only | Visual check on small screen sizes | N/A |
| ONBR-09 | Mailing List no overflow | manual-only | Visual check on small screen sizes | N/A |
| ONBR-10 | Onboarding CTAs blue pill shape | manual-only | Navigate through all onboarding screens | N/A |

### Sampling Rate
- **Per task commit:** Visual check on iOS simulator
- **Per wave merge:** Full onboarding flow walkthrough + main screens check
- **Phase gate:** Production build with EAS, full visual audit

### Wave 0 Gaps
- This phase is primarily visual polish -- no automated test infrastructure needed
- Manual verification checklist should accompany each plan
- The `expo lint` command can catch remaining hardcoded values as a smoke test

## Detailed File Audit

### Files Requiring Token Enforcement Sweep

**Onboarding screens (10 files):**
| File | Issues Found |
|------|-------------|
| `welcome.tsx` | Hardcoded `#FFFFFF` in checkmark, `fontSize: 30/16/12/14`, `fontWeight: '700'`, `marginTop: 8/24`, `gap: 12` |
| `ai-bird-id.tsx` | `fontSize: 28/16`, `fontWeight: '700'` |
| `name.tsx` | `fontSize: 24/16`, `fontWeight: '700'`, `marginBottom: 24`, `marginTop: 20`, `paddingHorizontal: 20`, `paddingVertical: 16` |
| `birding-journey.tsx` | `fontSize: 24/16/14`, `fontWeight: '700'/'600'` |
| `discover.tsx` | `fontSize: 28/16`, `fontWeight: '700'` |
| `community.tsx` (onboarding) | `fontSize: 28/16`, `fontWeight: '700'` |
| `green-time.tsx` | `fontSize: 28/16`, `fontWeight: '700'` |
| `goals.tsx` | `fontSize: 24/16`, `fontWeight: '700'/'600'` |
| `reminders.tsx` | `fontSize: 24/16`, `fontWeight: '700'`, `marginTop: 8`, `marginVertical: 40` |
| `mailing-list.tsx` | `fontSize: 24/16`, `fontWeight: '700'`, `marginTop: 8`, `marginVertical: 40`, `paddingVertical: 16` |
| `paywall.tsx` | `fontSize: 30/15/18/16/14/11`, `fontWeight: '700'/'600'`, multiple spacing values |

**Main screens (3 files):**
| File | Issues Found |
|------|-------------|
| `(main)/index.tsx` | `fontSize: 15/13/16`, `fontWeight: '600'/'700'`, `paddingVertical: 14`, multiple spacing values |
| `(main)/profile.tsx` | `fontSize: 24/13/18/12`, `fontWeight: '700'/'600'`, hardcoded hex colors `#FEF3C7`, `#DBEAFE`, `#FCE7F3`, `#D4EDDA` |
| `(main)/community.tsx` | `fontSize: 16/13/14/12`, `fontWeight: '700'`, `padding: 14`, multiple spacing values |

**Components (4 files):**
| File | Issues Found |
|------|-------------|
| `Button.tsx` | Uses `semantic.actionSecondary` (black) for primary -- should be `actionPrimary` (blue); `borderRadius: 16` should be `borderRadius.full`; `fontSize: 15`, `fontWeight: '700'` |
| `OnboardingLayout.tsx` | Footer `paddingHorizontal: 24` should be 16 per FOUN-09; `paddingBottom: bottom + 20` should be `bottom + 24` |
| `ProgressDots.tsx` | Inactive color is `borderDefault` (#D9D9D9), should be white at 50% opacity; active is correct (blue) |
| `BirdInfoCard.tsx` | `fontSize: 14/20/12`, `fontWeight: '700'/'600'`, `padding: 16`, `gap: 4` |

**Hardcoded hex values in app/ directory:**
- `profile.tsx`: `#FEF3C7` (= `semantic.rarityUncommonBg`), `#DBEAFE` (= `semantic.rarityCommonBg`), `#FCE7F3` (= `semantic.rarityRareBg`), `#D4EDDA` (= `semantic.statusSuccessBg`)
- `welcome.tsx`: `#FFFFFF` (= `semantic.textInverse` or `colors.neutral0`)

## Sources

### Primary (HIGH confidence)
- Codebase analysis: All 19 screen/component files read and audited
- Prior project research: `.planning/research/STACK.md`, `.planning/research/PITFALLS.md`, `.planning/research/ARCHITECTURE.md`
- expo-font config plugin: Documented in prior research, verified against Expo SDK 55 docs

### Secondary (MEDIUM confidence)
- @expo-google-fonts/rubik package: Path structure from prior research (`300/Rubik_300Light.ttf` pattern) -- needs verification after install
- expo-splash-screen fade configuration: Based on SDK 55 API

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed except @expo-google-fonts/rubik; prior research verified
- Architecture: HIGH - patterns well-established in codebase; build-time font approach documented
- Pitfalls: HIGH - font name mismatch and button color mismatch verified by reading actual code
- File audit: HIGH - every file read and specific issues catalogued with line-level detail

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- Expo SDK 55 is current, no breaking changes expected)

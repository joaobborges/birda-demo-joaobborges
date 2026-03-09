# Phase 1: Foundation - Research

**Researched:** 2026-03-09
**Domain:** Theme tokens, splash/hydration guard, React Compiler, ESLint
**Confidence:** HIGH

## Summary

Phase 1 establishes four foundational pillars: (1) centralizing all styling through the existing `src/theme/` token system and eliminating ~100+ hardcoded hex values across 14 screen/component files, (2) preventing the onboarding flash by holding the native splash screen until Zustand rehydrates from AsyncStorage, (3) enabling React Compiler for automatic memoization via Expo's built-in `experiments.reactCompiler` flag, and (4) adding ESLint with `jsx-no-leaked-render` and `no-barrel-files` rules.

The existing codebase already has a well-structured theme token system (`colors.ts`, `typography.ts`, `spacing.ts`, `components.ts`) and a Zustand store with AsyncStorage persistence. The work is primarily wiring and migration -- no new architectural patterns need to be invented.

**Primary recommendation:** Extend the existing `src/theme/colors.ts` with missing semantic tokens (rarity, status, accent), then do a single sweep across all files replacing hardcoded hex values. Implement the hydration guard in `app/_layout.tsx` using `expo-splash-screen` + Zustand's `onRehydrateStorage`. Enable React Compiler via `app.json` experiments flag. Add ESLint flat config with two targeted rules.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use birda.org blue palette (#1F87FE primary, #2DD1E6 accent) -- existing `src/theme/colors.ts` is the source of truth
- Replace all green-based hardcoded colors (#1B4332, #2D6A4F, etc.) with birda.org theme tokens
- Extend the semantic token system to include rarity colors (common/uncommon/rare badge backgrounds) and status colors (error red, success green)
- All screen backgrounds use single white (#FFFFFF / bgPage). Use #F8F8F8 (bgSurface) only for cards and secondary surfaces -- no warm off-whites
- Replace ALL hardcoded hex values across every screen file in Phase 1 -- one full sweep
- Files to touch: all `app/(onboarding)/*.tsx` (8 files), `app/(main)/*.tsx` (3 files), `src/components/**/*.tsx` (3 files)
- Zero hardcoded hex strings should remain in screen files after Phase 1
- Apply Rubik font globally in the same pass (already touching every file)
- Hold native splash screen (expo-splash-screen preventAutoHideAsync) until Zustand rehydrates from AsyncStorage
- After hydration: check onboarding completion state, navigate to map or onboarding, then hide splash
- User sees: native splash -> destination screen (no flash of wrong screen)
- ESLint with required rules only: jsx-no-leaked-render (error) and barrel file detection
- TypeScript parser configured
- No Prettier, no formatting enforcement, no auto-fix on save
- Formatting stays editor-default (consistent with current no-semicolons, single-quotes convention)

### Claude's Discretion
- React Compiler (babel-plugin-react-compiler) setup and Babel plugin ordering with Reanimated
- Exact ESLint config structure and rule implementation details
- Hydration guard implementation pattern (root layout vs index redirect)
- How to handle the theme barrel export in `src/theme/index.ts` given no-barrel-files rule (likely exempt since it's the theme system, not a component barrel)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUN-01 | App uses centralized theme tokens (colors, spacing) instead of hardcoded hex values | Existing `src/theme/` system is complete; needs rarity/status token extension and full migration sweep of ~100+ hardcoded hex values across 14 files |
| FOUN-02 | Returning users see map immediately -- no flash of onboarding (Zustand hydration guard) | `expo-splash-screen` preventAutoHideAsync + Zustand `onRehydrateStorage` callback pattern; implementation in `app/_layout.tsx` |
| FOUN-03 | React Compiler (babel-plugin-react-compiler) is enabled and auto-memoizes components | Expo SDK 55 supports via `experiments.reactCompiler: true` in app.json; `react-native-worklets/plugin` must be listed last in Babel config |
| FOUN-04 | ESLint enforces jsx-no-leaked-render and no-barrel-files rules | `eslint-plugin-react` for jsx-no-leaked-render; `eslint-plugin-no-barrel-files` for barrel detection; ESLint 9 flat config format |

</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | ^5.0.11 | State management with persist middleware | Already in use, provides `onRehydrateStorage` for hydration detection |
| @react-native-async-storage/async-storage | 2.2.0 | Persistent storage backend for Zustand | Already configured as Zustand persist storage |
| react-native-reanimated | 4.2.1 | Animations (Babel plugin ordering matters) | Already installed, worklets plugin handled by babel-preset-expo |
| expo | ~55.0.5 | Framework (includes babel-preset-expo with React Compiler support) | Already installed |

### To Install
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-splash-screen | ~0.30.x (SDK 55 compatible) | Hold native splash during hydration | FOUN-02: `preventAutoHideAsync()` + `hideAsync()` |
| eslint | ^9.x | Linting engine | FOUN-04: flat config format |
| @typescript-eslint/parser | ^8.x | TypeScript parsing for ESLint | FOUN-04: parse .tsx files |
| @typescript-eslint/eslint-plugin | ^8.x | TypeScript-specific rules | FOUN-04: TS awareness |
| eslint-plugin-react | ^7.x | React-specific rules including jsx-no-leaked-render | FOUN-04: leaked render detection |
| eslint-plugin-no-barrel-files | ^1.2.x | Barrel file detection | FOUN-04: enforce no barrel imports |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| eslint-plugin-no-barrel-files | eslint-plugin-barrel-files (thepassle) | Both work; `no-barrel-files` (art0rz) has simpler config and higher download count (157K/week) |
| eslint-plugin-react jsx-no-leaked-render | @eslint-react/no-leaked-conditional-rendering | eslint-react is newer but less established; stick with eslint-plugin-react for ecosystem compatibility |

**Installation:**
```bash
npx expo install expo-splash-screen
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-no-barrel-files
```

## Architecture Patterns

### Token Extension Pattern (FOUN-01)

The existing `src/theme/colors.ts` needs extension with missing semantic tokens. Current tokens cover brand, neutral, and basic semantics. Missing: accent, rarity, status, and several grays used across screens.

**Color mapping from hardcoded values to new tokens:**

| Hardcoded Hex | Semantic Meaning | New Token Name |
|---------------|-----------------|----------------|
| #2DD1E6 | Accent/teal (brand) | `accent` |
| #7265E3 | Secondary/purple (brand) | `secondary` |
| #EF4444 | Error/notification badge | `statusError` |
| #D4EDDA | Success background | `statusSuccessBg` |
| #DBEAFE | Rarity: common badge bg | `rarityCommonBg` |
| #FEF3C7 | Rarity: uncommon badge bg | `rarityUncommonBg` |
| #FCE7F3 | Rarity: rare badge bg | `rarityRareBg` |
| #9CA3AF | Placeholder text, muted | `neutral400` (new scale entry) |
| #6B7280 | Secondary text (same as neutral500) | Map to existing `neutral500` or add `neutral600` |
| #E5E7EB | Borders, dividers | Map to existing `neutral300` or adjust |
| #374151 | Strong body text | Map to existing `neutral800` or add `neutral650` |
| #F3F4F6 | Subtle surface bg | Map to existing `neutral100` |
| #1F2937 | Input text, dark text | Map to existing `neutral800` |
| #24292F | Welcome text | Map to existing `neutral900` |
| #000000 | Button bg (black) | `neutral950` or semantic `actionSecondary` |
| #FAFAF8 | Page backgrounds (warm off-white) | Replace with `bgPage` (#FFFFFF) per user decision |

**Strategy:** Add missing colors to the `colors` scale object, add semantic mappings for rarity/status, then replace every hardcoded hex reference.

### Hydration Guard Pattern (FOUN-02)

**What:** Hold native splash screen until Zustand store rehydrates, then route to correct screen.
**Where:** `app/_layout.tsx` (root layout)

**Implementation pattern:**
```typescript
// app/_layout.tsx
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { useOnboardingStore } from '@/stores/onboarding'

// Call at module scope, BEFORE component renders
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Zustand persist exposes hydration state via the store's persist API
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      setIsHydrated(true)
    })
    // If already hydrated (e.g., sync storage or fast load)
    if (useOnboardingStore.persist.hasHydrated()) {
      setIsHydrated(true)
    }
    return unsub
  }, [])

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync()
    }
  }, [isHydrated])

  if (!isHydrated) {
    return null // Native splash still visible
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      {DevPanel ? <DevPanel /> : null}
    </GestureHandlerRootView>
  )
}
```

**Key details:**
- `preventAutoHideAsync()` MUST be called at module scope (top-level), not inside a component
- Return `null` while not hydrated -- native splash screen stays visible
- `app/index.tsx` Redirect logic already works correctly once hydration completes
- Expo Router may auto-hide splash -- returning null from the layout prevents this by not rendering the navigator

### React Compiler Setup (FOUN-03)

**What:** Enable automatic memoization via Expo's built-in React Compiler integration.

**app.json addition:**
```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

**Babel plugin ordering concern:** Reanimated 4 uses `react-native-worklets/plugin` which must be listed last. Since the project has no custom `babel.config.js`, `babel-preset-expo` handles this automatically -- it includes both the React Compiler plugin and the worklets plugin in the correct order. **Do NOT create a custom babel.config.js unless necessary.** The preset handles ordering.

**Verification:** After enabling, run `npx expo start --clear` and check Metro output for compiler activity. In React DevTools, compiled components show a "Memo" badge.

### ESLint Flat Config (FOUN-04)

**What:** Minimal ESLint setup with two enforcement rules.

**`eslint.config.mjs`:**
```javascript
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import noBarrelFiles from 'eslint-plugin-no-barrel-files'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'no-barrel-files': noBarrelFiles,
    },
    rules: {
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'no-barrel-files/no-barrel-files': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Exempt theme barrel -- it IS the token system, not a component barrel
    files: ['src/theme/index.ts'],
    rules: {
      'no-barrel-files/no-barrel-files': 'off',
    },
  },
]
```

**Theme barrel exemption:** `src/theme/index.ts` is a legitimate aggregation point for design tokens, not a lazy re-export barrel. Exempt it from the no-barrel-files rule.

**package.json script:**
```json
{
  "scripts": {
    "lint": "eslint app/ src/"
  }
}
```

### Anti-Patterns to Avoid
- **Creating a custom babel.config.js just for React Compiler:** babel-preset-expo handles it. Only create one if you need custom plugin options.
- **Using `onRehydrateStorage` instead of `onFinishHydration`:** The `onRehydrateStorage` option fires at the start of hydration, not the end. Use `persist.onFinishHydration()` or `persist.hasHydrated()` for completion detection.
- **Calling preventAutoHideAsync inside useEffect:** It must run before the first render -- module scope, not component scope.
- **Hardcoding new hex values during token migration:** When a screen needs a color not in the token system, add a new token first, then reference it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Splash screen hold | Custom AppLoading component | `expo-splash-screen` preventAutoHideAsync/hideAsync | Native splash is smoother, avoids white flash between JS splash and app |
| Store hydration detection | Manual AsyncStorage.getItem checks | Zustand persist `onFinishHydration` / `hasHydrated` API | Built into zustand/middleware, handles edge cases |
| React memoization | Manual useMemo/useCallback everywhere | React Compiler via `experiments.reactCompiler` | Compiler handles it automatically, less code, fewer bugs |
| Leaked render detection | Code review only | ESLint `jsx-no-leaked-render` rule | Automated, catches `count && <Component />` rendering "0" |

## Common Pitfalls

### Pitfall 1: expo-splash-screen not installed
**What goes wrong:** `preventAutoHideAsync` import fails at runtime
**Why it happens:** expo-splash-screen is not in the current package.json dependencies
**How to avoid:** Run `npx expo install expo-splash-screen` before implementing FOUN-02
**Warning signs:** Import error on app launch

### Pitfall 2: Expo Router auto-hiding splash screen
**What goes wrong:** Splash hides before hydration completes, causing the onboarding flash
**Why it happens:** Expo Router has its own splash screen lifecycle that auto-hides when the router is ready
**How to avoid:** Return `null` from root layout while waiting for hydration -- this prevents the Stack navigator from rendering, which prevents Expo Router from considering the app "ready"
**Warning signs:** Flash of wrong screen on app launch (especially Android)

### Pitfall 3: Warm off-white backgrounds (#FAFAF8) left behind
**What goes wrong:** Some screens use `#FAFAF8` as page background, which doesn't match the user decision of pure white (#FFFFFF) for page backgrounds
**Why it happens:** Every existing screen uses `#FAFAF8` -- easy to miss one
**How to avoid:** All `backgroundColor: '#FAFAF8'` in page containers must become `semantic.bgPage` (#FFFFFF). Only card/surface fills should use `semantic.bgSurface` (#F8F8F8)
**Warning signs:** Inconsistent background color between screens

### Pitfall 4: Green colors used as primary actions
**What goes wrong:** Several screens use `#1B4332` (dark green) and `#2D6A4F` (medium green) for headings, buttons, and active states -- these must all become birda blue tokens
**Why it happens:** Original codebase was green-themed
**How to avoid:** Search for all green hex codes and map each to appropriate birda token (most heading colors -> `semantic.textPrimary`, active states -> `semantic.actionPrimary`)
**Warning signs:** Green elements remaining in UI after migration

### Pitfall 5: React Compiler + Reanimated worklet conflicts
**What goes wrong:** Worklet functions incorrectly compiled by React Compiler
**Why it happens:** React Compiler might try to optimize worklet functions that run on the UI thread
**How to avoid:** Don't create a custom babel.config.js -- let babel-preset-expo handle plugin ordering. If issues arise, use `'use no memo'` directive in worklet-heavy files
**Warning signs:** Reanimated runtime errors after enabling React Compiler

### Pitfall 6: ESLint jsx-no-leaked-render false positives with booleans
**What goes wrong:** Rule flags `{isVisible && <Component />}` even when `isVisible` is strictly boolean
**Why it happens:** Rule can't always infer types without full type-checking
**How to avoid:** Use `validStrategies: ['ternary']` to enforce ternary pattern consistently (which the codebase already uses). Consistent style, no false positive confusion
**Warning signs:** Lint errors on existing boolean conditionals

## Code Examples

### Extending colors.ts with rarity and status tokens
```typescript
// src/theme/colors.ts -- additions
export const colors = {
  // ... existing brand + neutral ...

  // ── Accent ──
  accent: '#2DD1E6',       // Teal accent (birda.org)
  secondary: '#7265E3',    // Purple secondary (birda.org)

  // ── Extended Neutral ──
  neutral950: '#000000',   // Pure black (buttons)
  neutral400: '#9CA3AF',   // Placeholders, muted icons
  neutral600: '#6B7280',   // Secondary text, captions
  neutral650: '#374151',   // Strong body text
  neutral750: '#1F2937',   // Input text, dark labels

  // ── Status ──
  statusError: '#EF4444',
  statusSuccessBg: '#D4EDDA',

  // ── Rarity ──
  rarityCommonBg: '#DBEAFE',
  rarityUncommonBg: '#FEF3C7',
  rarityRareBg: '#FCE7F3',
} as const

export const semantic = {
  // ... existing tokens ...

  // ── New semantic tokens ──
  textMuted: colors.neutral400,
  textBody: colors.neutral650,
  textInput: colors.neutral750,

  actionSecondary: colors.neutral950,
  actionSecondaryText: colors.neutral0,

  accent: colors.accent,
  secondary: colors.secondary,
} as const
```

### Hydration guard in root layout
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { useOnboardingStore } from '@/stores/onboarding'

SplashScreen.preventAutoHideAsync()

const DevPanel = __DEV__ ? require('@/components/dev/DevPanel').default : null

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = useState(
    useOnboardingStore.persist.hasHydrated()
  )

  useEffect(() => {
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      setIsHydrated(true)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync()
    }
  }, [isHydrated])

  if (!isHydrated) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      {DevPanel ? <DevPanel /> : null}
    </GestureHandlerRootView>
  )
}
```

### Token migration example (before/after)
```typescript
// BEFORE (e.g., app/(onboarding)/name.tsx)
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF8',   // hardcoded warm off-white
  },
  title: {
    color: '#1B4332',             // hardcoded green
  },
  input: {
    borderBottomColor: '#1B4332', // hardcoded green
    color: '#1F2937',             // hardcoded dark
  },
})

// AFTER
import { semantic } from '@/theme/colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: semantic.bgPage,        // #FFFFFF (user decision)
  },
  title: {
    color: semantic.textPrimary,             // #2D3142
  },
  input: {
    borderBottomColor: semantic.actionPrimary, // #1F87FE
    color: semantic.textInput,                 // maps to appropriate dark
  },
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-native-reanimated/plugin` | `react-native-worklets/plugin` | Reanimated 4.x (2025) | babel-preset-expo handles this automatically |
| Manual useMemo/useCallback | React Compiler auto-memoization | React Compiler 1.0 (Oct 2025) | Enable via `experiments.reactCompiler: true` |
| ESLint legacy config (.eslintrc) | ESLint 9 flat config (eslint.config.mjs) | ESLint 9 (2024), Expo SDK 53+ | Use flat config format |
| `SplashScreen.preventAutoHideAsync()` only | Same API but Expo Router interaction | SDK 54+ | Must return null from layout to prevent Router auto-hide |

## Open Questions

1. **Exact neutral color mapping**
   - What we know: The codebase uses ~8 different gray hex values (#6B7280, #9CA3AF, #374151, #E5E7EB, etc.)
   - What's unclear: Whether each should become a distinct token or some should merge into existing tokens
   - Recommendation: Create distinct tokens for each unique value during migration, then consolidate visually similar ones if desired. Functional correctness first.

2. **Switch component trackColor tokens**
   - What we know: `notifications.tsx` uses `trackColor={{ false: '#E5E7EB', true: '#2D6A4F' }}`
   - What's unclear: What the active track color should be in the birda palette (likely `actionPrimary` blue)
   - Recommendation: Use `semantic.actionPrimary` for active track, `semantic.borderDefault` for inactive track

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test framework installed |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-01 | No hardcoded hex in screen files | manual grep | `grep -rn '#[0-9a-fA-F]\{3,8\}' app/ src/components/ --include='*.tsx'` | N/A (shell command) |
| FOUN-02 | No flash of onboarding for returning user | manual-only | Visual verification on device/simulator | N/A |
| FOUN-03 | React Compiler active | manual-only | Check Metro bundler output or React DevTools Memo badge | N/A |
| FOUN-04 | Lint catches leaked renders and barrel files | lint | `npx eslint app/ src/` | No eslint.config.mjs yet (Wave 0) |

### Sampling Rate
- **Per task commit:** `grep -rn '#[0-9a-fA-F]\{3,8\}' app/ src/components/ --include='*.tsx'` (zero results = pass)
- **Per wave merge:** `npx eslint app/ src/` (zero errors = pass)
- **Phase gate:** All four checks green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `eslint.config.mjs` -- ESLint flat config for FOUN-04
- [ ] Install eslint and plugins: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-no-barrel-files`
- [ ] Install expo-splash-screen: `npx expo install expo-splash-screen`
- [ ] Add `"lint": "eslint app/ src/"` script to package.json

## Sources

### Primary (HIGH confidence)
- [Expo SDK 55 React Compiler docs](https://docs.expo.dev/guides/react-compiler/) -- `experiments.reactCompiler: true` flag
- [Expo splash-screen API](https://docs.expo.dev/versions/latest/sdk/splash-screen/) -- preventAutoHideAsync/hideAsync pattern
- [Reanimated 4 getting started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) -- worklets plugin must be last
- [eslint-plugin-react jsx-no-leaked-render](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md) -- rule config and validStrategies
- [eslint-plugin-no-barrel-files](https://www.npmjs.com/package/eslint-plugin-no-barrel-files) -- flat config setup

### Secondary (MEDIUM confidence)
- [Expo Router splash screen issue #40464](https://github.com/expo/expo/issues/40464) -- Router auto-hide behavior and workarounds
- [Zustand persist hydration discussion](https://github.com/pmndrs/zustand/discussions/426) -- onFinishHydration/hasHydrated API
- [Expo ESLint guide](https://docs.expo.dev/guides/using-eslint/) -- flat config recommended from SDK 53+

### Tertiary (LOW confidence)
- React Compiler + Reanimated 4 worklet interaction -- no official docs confirm they work together seamlessly; babel-preset-expo presumably handles ordering but edge cases with worklet functions are unverified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified, versions from package.json
- Architecture: HIGH -- patterns verified against official docs; existing codebase structure is clear
- Pitfalls: MEDIUM -- Expo Router splash interaction is a known issue with workarounds; React Compiler + Reanimated interop is low-confidence
- Token migration: HIGH -- complete grep of hardcoded values done, mapping is straightforward

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable ecosystem, no fast-moving changes expected)

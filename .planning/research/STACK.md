# Technology Stack

**Project:** Birda -- Bird Watching Companion App (Interview Prototype)
**Researched:** 2026-03-09

## Recommended Stack

This is a brownfield project. The core stack (Expo SDK 55, React Native 0.83, Expo Router, Zustand, Reanimated 4) is already installed and correct. This document focuses on what needs to be **added** to complete the prototype features and what configuration changes are required.

### Core Framework (Already Installed -- No Changes)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Expo | ~55.0.5 | App shell and device APIs | Installed |
| React Native | 0.83.2 | Cross-platform mobile framework | Installed |
| React | 19.2.0 | UI component library | Installed |
| Expo Router | ~55.0.4 | File-based navigation | Installed |
| TypeScript | ~5.9.2 | Type safety | Installed |

**Confidence:** HIGH -- verified from `package.json` in the project.

### Animation and Gestures (Already Installed -- No Changes)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| React Native Reanimated | 4.2.1 | UI thread animations (shared values, layout animations, entering/exiting) | Installed |
| React Native Gesture Handler | ~2.30.0 | Gesture API (Tap, Pan for button press, draggable DevPanel) | Installed |
| React Native Worklets | ^0.7.4 | Worklet runtime for Reanimated 4 | Installed |

**Confidence:** HIGH -- verified from `package.json`. Reanimated 4 is the correct version for RN 0.83 + New Architecture.

### State Management (Already Installed -- No Changes)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Zustand | ^5.0.11 | Global state with persist middleware | Installed |
| AsyncStorage | 2.2.0 | Persistent key-value storage for Zustand | Installed |

**Confidence:** HIGH -- verified from `package.json`.

### Map (Partially Installed -- Needs Clustering)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| react-native-maps | 1.26.20 | Map rendering (Apple Maps iOS, Google Maps Android) | Installed |
| react-native-map-clustering | ^3.4 | Automatic marker clustering at low zoom levels | **Needs install** |

**Why react-native-map-clustering:** It wraps `react-native-maps` MapView with Supercluster-based clustering. Drop-in replacement -- you swap `<MapView>` for `<ClusteredMapView>`. The PRD specifies this library. It uses Supercluster under the hood which is the industry standard for geographic point clustering. No meaningful alternative exists in the React Native ecosystem for this purpose.

**Confidence:** MEDIUM -- library is well-known and specified in the PRD. Version 3.4.x is the latest stable line compatible with react-native-maps 1.x. Unable to verify the exact latest version via npm due to tool restrictions; pin to `^3.4` and let npm resolve.

### UI and Media (Partially Installed)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| expo-image | ~55.0.6 | High-performance image loading with caching, blurhash | Installed |
| expo-haptics | ~55.0.8 | Haptic feedback on CTA buttons | Installed |
| expo-font | ~55.0.4 | Custom fonts via config plugin (no runtime loading) | Installed |
| expo-status-bar | ~55.0.4 | Translucent status bar for full-bleed map | Installed |
| react-native-safe-area-context | ~5.6.2 | Safe area inset handling for floating UI | Installed |
| react-native-screens | ~4.23.0 | Native screen containers, formSheet presentation | Installed |

**Confidence:** HIGH -- all verified from `package.json` and `node_modules`.

### Form Sheet Presentation (Already Supported -- Configuration Only)

react-native-screens 4.23.0 has full `formSheet` presentation support with `sheetAllowedDetents` -- verified by grepping `node_modules/react-native-screens`. No additional library needed. Configure in Expo Router Stack screen options:

```typescript
// app/(main)/_layout.tsx
<Stack.Screen
  name="profile"
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: [0.75, 1.0],
    sheetGrabberVisible: true,
    sheetCornerRadius: 20,
  }}
/>
```

**Confidence:** HIGH -- verified `formSheet` and `sheetAllowedDetents` exist in the installed react-native-screens source.

### List Performance (Already Installed -- Configuration Only)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| @legendapp/list (LegendList) | 2.0.19 | Community feed list (drop-in FlatList replacement) | Installed |

**Why LegendList over FlashList:** LegendList supports dynamic item heights out of the box without `estimatedItemSize` guessing. For a community feed with variable-height sighting cards (image + text + metadata), this avoids the common FlashList issue of blank spaces or layout jumps. The API is a direct FlatList drop-in. The PRD already specifies this choice.

**Risk:** LegendList has a smaller community than FlashList. If it becomes unmaintained, FlashList (`@shopify/flash-list`) is the fallback. For a prototype with ~20-50 items, even vanilla FlatList would work, so this is low risk.

**Confidence:** HIGH -- verified version 2.0.19 installed in `node_modules`.

### React Compiler (Already Installed -- Configuration Needed)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| babel-plugin-react-compiler | 1.0.0 | Auto-memoization (eliminates manual memo/useMemo/useCallback) | Installed but not configured |

The plugin is in `node_modules` but NOT in `devDependencies` in `package.json` and likely not in `babel.config.js`. Needs:

1. Add to `devDependencies`: `"babel-plugin-react-compiler": "^1.0.0"`
2. Add to `babel.config.js`:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['babel-plugin-react-compiler'],
  };
};
```

**Confidence:** HIGH -- verified version 1.0.0 in `node_modules`. React Compiler reached 1.0 stable and works with React 19.

### ESLint (Needs Install and Configuration)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| eslint | ^9.0 | Code linting framework | **Needs install** |
| @expo/eslint-config | latest | Expo-aware ESLint preset | **Needs install** |
| eslint-plugin-react | latest | JSX safety rules (jsx-no-leaked-render) | **Needs install** |
| eslint-plugin-no-barrel-files | latest | Prevent barrel imports | **Needs install** |

**Why these specific rules matter:**
- `react/jsx-no-leaked-render`: Prevents the `{count && <Text>}` crash pattern in React Native where falsy numbers render as text and crash. This is a production crash preventer, not a style preference.
- `no-barrel-files`: Barrel imports (`import { X } from '@/components'`) force Metro to evaluate every export in the barrel, bloating bundle size and slowing TTI. Direct imports are mandatory for production performance.

**Confidence:** MEDIUM -- ESLint 9 with flat config is the current standard. Exact compatible versions of `@expo/eslint-config` for SDK 55 should be verified at install time.

### Production Bundle Optimizations (Configuration Only -- No New Dependencies)

These are environment variables and build config changes, not new packages:

| Optimization | How to Enable | Impact |
|-------------|---------------|--------|
| Tree shaking | `.env`: `EXPO_UNSTABLE_TREE_SHAKING=1` + `EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1` | 10-15% bundle reduction |
| Hermes mmap (Android) | Disable JS bundle compression in `android/app/build.gradle` | Faster cold start |
| R8 shrinking (Android) | `enableProguardInReleaseBuilds = true` in `build.gradle` | ~30% APK reduction |
| iOS Asset Catalog | Xcode build phase `EXTRA_PACKAGER_ARGS` | ~40% image size reduction per device |

**Confidence:** HIGH -- these are documented Expo/React Native production optimizations. Already specified in the PRD.

## New Dependencies to Install

Only two new npm packages are needed:

```bash
# Production dependency
npm install react-native-map-clustering

# Dev dependencies
npm install -D eslint @expo/eslint-config eslint-plugin-react eslint-plugin-no-barrel-files
```

**Note:** `babel-plugin-react-compiler` is already in `node_modules` but should be explicitly added to `devDependencies` if not already there:
```bash
npm install -D babel-plugin-react-compiler
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Map clustering | react-native-map-clustering | Custom Supercluster integration | Map clustering lib wraps Supercluster already, no reason to DIY for a prototype |
| List performance | @legendapp/list (LegendList) | @shopify/flash-list | FlashList requires `estimatedItemSize` which causes layout jumps with variable-height feed items. LegendList handles dynamic heights natively. Already installed. |
| Form sheets | react-native-screens (formSheet) | react-native-bottom-sheet (gorhom) | react-native-screens formSheet is native iOS presentation -- better performance, native swipe-to-dismiss, keyboard avoidance for free. No extra dependency needed. gorhom/bottom-sheet is JS-driven and heavier. |
| Animations | react-native-reanimated 4 | Moti, React Native Animated | Reanimated 4 is already installed, runs on UI thread, supports layout animations. Moti wraps Reanimated anyway. Built-in Animated API runs on JS thread. |
| State management | Zustand 5 | Redux Toolkit, Jotai, Legend State | Zustand is already installed, minimal boilerplate, persist middleware works well. Redux is overkill for a prototype. Jotai/Legend State would require migration. |
| Gradients | RN experimental_backgroundImage | expo-linear-gradient | React Native now supports CSS-style linear-gradient via `experimental_backgroundImage`. No third-party dependency needed. Available in RN 0.83+. |
| Shadows | RN boxShadow | react-native-shadow-2 | React Native 0.83 supports CSS `boxShadow` syntax natively. No library needed. |
| Compiler optimization | babel-plugin-react-compiler | Manual memo/useMemo/useCallback | React Compiler auto-memoizes. Eliminates manual optimization boilerplate. Already installed. Works with React 19. |
| ESLint | eslint 9 + flat config | Biome | ESLint has the specific React Native plugins needed (jsx-no-leaked-render, no-barrel-files). Biome lacks these specialized rules. |

## What NOT to Use

| Library | Why Avoid |
|---------|-----------|
| expo-linear-gradient | Unnecessary -- RN 0.83 has `experimental_backgroundImage: 'linear-gradient(...)'` built in |
| react-native-shadow-2 | Unnecessary -- RN 0.83 has `boxShadow` built in |
| @gorhom/bottom-sheet | Unnecessary -- react-native-screens formSheet gives native iOS sheet presentation for free |
| @shopify/flash-list | Already chose LegendList (installed). Switching adds migration cost with no benefit for ~50 items. |
| expo-splash-screen | Not needed for prototype scope. Hydration splash can be a simple View with ActivityIndicator. |
| react-native-mmkv | AsyncStorage is sufficient for persisting onboarding state. MMKV adds native build complexity for negligible perf gain at this data volume. |
| NativeWind / Tailwind | Project uses StyleSheet.create with co-located styles. Adding NativeWind mid-project creates style inconsistency. Not worth the migration for a prototype. |
| react-query / TanStack Query | No API calls, no backend. All data is local JSON. Data fetching libraries add complexity with zero value here. |

## Stack Architecture Summary

```
Expo SDK 55 + React Native 0.83 (New Architecture)
  |
  +-- Navigation: Expo Router (file-based, native stack)
  |     +-- Form sheets: react-native-screens formSheet presentation
  |
  +-- UI: StyleSheet.create + Reanimated 4 animations
  |     +-- Images: expo-image (caching, blurhash)
  |     +-- Haptics: expo-haptics
  |     +-- Fonts: expo-font (config plugin)
  |     +-- Gradients: experimental_backgroundImage (built-in)
  |     +-- Shadows: boxShadow (built-in)
  |
  +-- Map: react-native-maps + react-native-map-clustering
  |
  +-- Lists: @legendapp/list (LegendList)
  |
  +-- State: Zustand 5 + AsyncStorage persistence
  |
  +-- Optimization: babel-plugin-react-compiler (auto-memoization)
  |
  +-- Quality: ESLint 9 (jsx-no-leaked-render, no-barrel-files)
  |
  +-- Build: EAS Build (dev/preview/production profiles)
       +-- Metro tree shaking + R8 shrinking + Hermes mmap
```

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Core stack (Expo/RN/Router/Zustand) | HIGH | Verified from installed packages |
| Reanimated 4 + Gesture Handler | HIGH | Verified installed, correct versions for RN 0.83 |
| react-native-map-clustering | MEDIUM | Correct library per PRD, version needs npm resolution at install time |
| LegendList | HIGH | Verified v2.0.19 installed |
| formSheet presentation | HIGH | Verified in react-native-screens 4.23.0 source |
| React Compiler | HIGH | Verified v1.0.0 installed, stable release |
| ESLint plugins | MEDIUM | Standard approach, exact version compatibility should be verified at install |
| Production optimizations | HIGH | Standard documented Expo/RN patterns |
| Built-in gradients/shadows | MEDIUM | Based on RN 0.83 features -- `experimental_backgroundImage` is marked experimental but functional |

## Sources

- Project `package.json` -- verified all installed dependency versions
- Project `node_modules/` -- verified react-native-screens formSheet support, React Compiler v1.0.0, LegendList v2.0.19
- PRD (`PRD-CLAUDE/01-PRD.md`) -- library choices and architecture decisions
- Codebase analysis (`.planning/codebase/STACK.md`, `ARCHITECTURE.md`, `CONCERNS.md`) -- current state and known issues

---

*Stack research: 2026-03-09*

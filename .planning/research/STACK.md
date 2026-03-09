# Technology Stack

**Project:** Birda v1.1 Polish & Refinement
**Researched:** 2026-03-09
**Scope:** Stack additions for v1.1 milestone features ONLY. Core stack (Expo SDK 55, RN 0.83, Expo Router, Zustand, Reanimated 4, etc.) is validated and unchanged.

## New Dependencies Required

Only **two** new npm packages are needed for all v1.1 features:

| Technology | Version | Purpose | Why This One |
|------------|---------|---------|--------------|
| @gorhom/bottom-sheet | ^5.2.8 | Auth option drawer, map bird info drawer | Industry standard bottom sheet for React Native. Peer deps explicitly support `react-native-reanimated >=3.16.0 \|\| >=4.0.0-` and `react-native-gesture-handler >=2.16.1` -- both satisfied by current stack (Reanimated 4.2.1, RNGH 2.30). Runs entirely on UI thread. Provides snap points, backdrop, keyboard avoidance, and scroll interaction out of the box. |
| @expo-google-fonts/rubik | ^0.4.2 | Rubik font TTF assets for build-time embedding | Provides the actual TTF files for Rubik weight variants (300 Light, 400 Regular, 500 Medium, 600 SemiBold). The project references `fontFamily: 'Rubik'` in typography tokens but never loads the font -- it silently falls back to system font. This package supplies the assets; `expo-font` (already installed) handles the loading. |

**Confidence:** HIGH -- both packages verified via npm. @gorhom/bottom-sheet peer dependencies confirmed compatible. @expo-google-fonts/rubik is the official Expo-maintained font package.

## Existing Stack Capabilities (No New Packages)

Three of the five v1.1 features require zero new dependencies:

| Feature | Existing Library | How It Works |
|---------|-----------------|--------------|
| Splash screen with logo | expo-splash-screen ~55.0.10 | Already installed and in app.json plugins. Only needs config plugin options (image path, backgroundColor, imageWidth). |
| Auto-scrolling mosaic/ticker | react-native-reanimated 4.2.1 | `useFrameCallback` for frame-accurate continuous animation + `useAnimatedStyle` with `translateX`. This is the exact pattern from Reanimated's official marquee example. ~40 lines of code, no library needed. |
| Native iOS tab bar | expo-router ~55.0.4 | `NativeTabs` component from `expo-router/unstable-native-tabs` submodule. Uses actual UITabBarController on iOS. Available since SDK 54, included in SDK 55. No separate package install. |

**Confidence:** HIGH -- all three verified via official documentation.

## Installation

```bash
# Bottom sheet for auth drawer and map bird info
npx expo install @gorhom/bottom-sheet

# Rubik font assets (TTF files for build-time embedding)
npx expo install @expo-google-fonts/rubik
```

No EAS rebuild is required for @gorhom/bottom-sheet (pure JS + Reanimated worklets). A rebuild IS required after changing the expo-font plugin config to embed fonts (native asset change).

## Integration Details

### 1. Splash Screen (expo-splash-screen -- config change only)

The current app.json has `"expo-splash-screen"` as a bare plugin string. Update to include the logo asset and brand colors:

```json
[
  "expo-splash-screen",
  {
    "image": "./assets/splash-logo.png",
    "backgroundColor": "#FFFFFF",
    "imageWidth": 200
  }
]
```

**Requirements:**
- Logo image must be PNG with transparent background, recommended 1024x1024 source
- `imageWidth` controls rendered size (default 100, max recommended 200)
- Testing requires a preview/production build -- dev builds do not accurately render the splash screen

**Existing code integration:** The root `_layout.tsx` already calls `SplashScreen.preventAutoHideAsync()` and `SplashScreen.hideAsync()` after Zustand hydration. No code changes needed -- only the app.json config plugin update.

**Confidence:** HIGH -- expo-splash-screen is already installed and wired up in _layout.tsx.

### 2. Rubik Font Loading (expo-font config plugin + @expo-google-fonts/rubik)

**Current problem:** `src/theme/typography.ts` specifies `fontFamily: 'Rubik'` for all text styles, but the font is never loaded. Text renders in the system font (San Francisco on iOS) without any error.

**Solution -- build-time embedding via config plugin:**

Update `app.json` to change the bare `"expo-font"` plugin to include font file paths:

```json
[
  "expo-font",
  {
    "fonts": [
      "node_modules/@expo-google-fonts/rubik/300/Rubik_300Light.ttf",
      "node_modules/@expo-google-fonts/rubik/400/Rubik_400Regular.ttf",
      "node_modules/@expo-google-fonts/rubik/500/Rubik_500Medium.ttf",
      "node_modules/@expo-google-fonts/rubik/600/Rubik_600SemiBold.ttf"
    ]
  }
]
```

**Typography token update required:** Build-time embedded fonts register under their file names. The typography tokens must change from generic family name to weight-specific names:

```typescript
// Before (broken -- font never loaded)
fontFamily: 'Rubik'
fontWeight: '300'

// After (working -- build-time embedded)
fontFamily: 'Rubik_300Light'
// fontWeight is encoded in the family name, no separate fontWeight needed
```

**Why build-time over useFonts hook:** Build-time embedding means fonts are available immediately at app launch. No async loading, no flash of unstyled text, no need to delay splash screen hide for font loading. Since the app uses EAS builds (not Expo Go), this approach works perfectly.

**Why NOT useFonts:** The runtime `useFonts` hook would require adding font loading state to the root layout, coordinating with the existing splash screen hide logic, and introduces a brief moment where text could render without Rubik. Build-time embedding avoids all of this.

**Confidence:** HIGH -- verified via Expo fonts documentation. The expo-font plugin config is the recommended approach for EAS builds.

### 3. Auto-Scrolling Mosaic/Ticker (Reanimated -- code only)

No library needed. The pattern uses Reanimated's `useFrameCallback` for smooth, frame-accurate continuous scrolling:

```typescript
const offset = useSharedValue(0);
const SPEED = 0.03; // pixels per millisecond

useFrameCallback((frameInfo) => {
  const dt = frameInfo.timeSincePreviousFrame ?? 16;
  offset.value = (offset.value + dt * SPEED) % CONTENT_WIDTH;
});

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: -offset.value }],
}));
```

**Implementation pattern:** Render the mosaic content twice side-by-side (duplicated). As the first copy scrolls off-screen left, the second copy seamlessly fills in from the right. The modulo operation (`% CONTENT_WIDTH`) resets the offset to create an infinite loop without jumps.

**Why `useFrameCallback` over `withTiming` loop:** `withTiming` with `withRepeat` would work for simple cases, but `useFrameCallback` gives frame-accurate delta-time animation that maintains consistent speed regardless of frame drops. It also allows pausing/resuming and speed changes without restarting the animation.

**Why no external library:** Libraries like `@animatereactnative/marquee` or `react-native-auto-scroll` are either text-focused (not image mosaic) or use the old Animated API (JS thread, not UI thread). The mosaic is ~40 lines of Reanimated code that runs entirely on the UI thread.

**Confidence:** HIGH -- `useFrameCallback` is a documented Reanimated API. The marquee example on Reanimated's official docs uses this exact pattern.

### 4. Bottom Sheet Drawers (@gorhom/bottom-sheet)

Two uses in v1.1:
1. **Auth drawer** on welcome screen -- Login/Create Account with Apple, Google, Email options
2. **Map bird info drawer** -- full-width swipeable drawer showing bird details, rendered above all content

**Prerequisites already satisfied:**
- `GestureHandlerRootView` wraps the entire app in `_layout.tsx` (required by @gorhom/bottom-sheet)
- `react-native-reanimated` 4.2.1 installed (peer dependency satisfied)
- `react-native-gesture-handler` 2.30 installed (peer dependency satisfied)

**Usage pattern:**

```typescript
import BottomSheet from '@gorhom/bottom-sheet';

const snapPoints = useMemo(() => ['25%', '50%'], []);

<BottomSheet
  ref={bottomSheetRef}
  snapPoints={snapPoints}
  enablePanDownToClose
>
  {/* Content */}
</BottomSheet>
```

**Portal pattern for map drawer:** The map bird info bottom sheet must render at the route level (in the layout, not inside the map component) to ensure it appears above all content including the floating UI overlay. Pass bird selection state via Zustand store or a simple ref.

**Confidence:** HIGH -- peer dependencies verified via npm. GestureHandlerRootView already wraps the app.

### 5. Native iOS Tab Bar (expo-router NativeTabs)

Import from the submodule (no install needed):

```typescript
import { NativeTabs } from 'expo-router/unstable-native-tabs';
```

**Route structure required:**

```
app/
  (main)/
    (tabs)/
      _layout.tsx      <- NativeTabs layout
      index.tsx         <- Map/Home
      capture.tsx       <- Capture tab (visual only)
      logbook.tsx       <- Logbook tab (visual only)
```

**Tab layout implementation:**

```typescript
export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sfSymbol="map.fill" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="capture">
        <NativeTabs.Trigger.Icon sfSymbol="camera.fill" />
        <NativeTabs.Trigger.Label>Capture</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="logbook">
        <NativeTabs.Trigger.Icon sfSymbol="book.fill" />
        <NativeTabs.Trigger.Label>Logbook</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

**SF Symbols:** NativeTabs supports iOS SF Symbol names directly for tab icons -- no Ionicons image imports needed. This gives a truly native appearance.

**Architecture consideration:** The current app uses floating custom nav UI on the map (decided in v1.0 to avoid tab bar fighting with map gestures). Adding NativeTabs means either: (a) replacing the floating nav entirely with native tabs, or (b) keeping floating nav for map-specific actions and using native tabs for top-level navigation. The v1.1 requirement specifies "Native iOS tab bar for Capture/Logbook on home screen," suggesting approach (b) -- native tabs for screen switching, floating UI for map actions.

**Caveat:** NativeTabs API is marked "alpha" and imported from `unstable-native-tabs`. This is acceptable for a prototype/demo. The API has been stable through SDK 54-55 and is unlikely to break within SDK 55's lifetime.

**Confidence:** HIGH -- verified via Expo Router docs and SDK 55 changelog. NativeTabs is a submodule of the already-installed expo-router.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Bottom sheet | @gorhom/bottom-sheet | formSheet (react-native-screens) | v1.0 research recommended formSheet, but v1.1 requirements specify swipeable drawer behavior with snap points, backdrop, and scroll interaction. formSheet is a modal presentation, not a drawer. gorhom provides the drawer UX pattern the designs require. |
| Bottom sheet | @gorhom/bottom-sheet | Custom Reanimated sheet | Gorhom handles keyboard avoidance, nested scroll views, snap points, backdrop animation, and gesture conflict resolution. Building this correctly takes weeks. |
| Ticker animation | Raw Reanimated | @animatereactnative/marquee | Adding a dependency for ~40 lines of code. Marquee libs are text-focused; the mosaic is image tiles. |
| Ticker animation | Raw Reanimated | react-native-auto-scroll | Uses old Animated API (JS thread). Not Reanimated-based. |
| Tab bar | NativeTabs (expo-router) | @react-navigation/bottom-tabs | NativeTabs uses actual UITabBarController. JS bottom tabs render a styled View. For a demo showcasing iOS craft, native wins. |
| Tab bar | NativeTabs (expo-router) | Keep floating nav only | The requirement explicitly asks for a native iOS tab bar. Floating nav stays for map-specific actions. |
| Font loading | Build-time (expo-font plugin) | Runtime (useFonts hook) | Build-time means fonts available at launch -- no async loading, no FOUT, simpler code. Project uses EAS builds, so build-time embedding works. |
| Font package | @expo-google-fonts/rubik | Manual TTF download | @expo-google-fonts is maintained by Expo team, provides all weight variants, and works seamlessly with the expo-font config plugin. |

## What NOT to Add

| Library | Why Avoid |
|---------|-----------|
| react-native-splash-screen (community) | expo-splash-screen is already installed and is the Expo-maintained solution |
| Any marquee/ticker library | Reanimated handles this with ~40 lines. No dependency needed. |
| @react-navigation/bottom-tabs | NativeTabs gives genuinely native UITabBarController. JS tabs are just styled Views. |
| expo-google-fonts (root monorepo) | Install only `@expo-google-fonts/rubik`, not the root package |
| react-native-modal | Not a bottom sheet. No snap points, no gesture-driven behavior, no Reanimated. |
| Additional icon library | SF Symbols work natively with NativeTabs. Ionicons (already installed) covers everything else. |

## Stack Architecture After v1.1

```
Expo SDK 55 + React Native 0.83 (New Architecture)
  |
  +-- Navigation: Expo Router
  |     +-- NativeTabs (unstable-native-tabs) for Home/Capture/Logbook
  |     +-- Stack screens for onboarding, paywall
  |
  +-- UI: StyleSheet.create + Reanimated 4 animations
  |     +-- Bottom sheets: @gorhom/bottom-sheet (auth drawer, map drawer)
  |     +-- Images: expo-image
  |     +-- Haptics: expo-haptics
  |     +-- Fonts: expo-font plugin + @expo-google-fonts/rubik (build-time)
  |     +-- Splash: expo-splash-screen (config plugin)
  |
  +-- Map: react-native-maps + raw Supercluster
  |
  +-- Lists: @legendapp/list (LegendList)
  |
  +-- State: Zustand 5 + AsyncStorage persistence
  |
  +-- Build: EAS Build (dev/preview/production profiles)
```

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| @gorhom/bottom-sheet compatibility | HIGH | Peer deps verified via npm: reanimated >=4.0.0- supported, RNGH >=2.16.1 supported |
| expo-splash-screen config | HIGH | Already installed and wired in _layout.tsx. Config plugin change only. |
| Rubik font loading | HIGH | expo-font plugin documented for build-time embedding. Font package available. |
| NativeTabs | HIGH | Built into expo-router ~55.0.4. Verified in Expo docs and SDK 55 changelog. Alpha API acceptable for prototype. |
| Mosaic/ticker animation | HIGH | useFrameCallback is documented Reanimated API. Official marquee example uses this exact pattern. |

## Sources

- [Expo Splash Screen docs](https://docs.expo.dev/versions/latest/sdk/splash-screen/) -- config plugin API, image requirements
- [Expo Fonts docs](https://docs.expo.dev/develop/user-interface/fonts/) -- build-time embedding via config plugin
- [@expo-google-fonts/rubik npm](https://www.npmjs.com/package/@expo-google-fonts/rubik) -- v0.4.2, font variants
- [Expo Router Native Tabs docs](https://docs.expo.dev/router/advanced/native-tabs/) -- NativeTabs API, alpha status
- [Expo Router Native Tabs SDK reference](https://docs.expo.dev/versions/latest/sdk/router-native-tabs/) -- component props, SF Symbols
- [@gorhom/bottom-sheet npm](https://www.npmjs.com/package/@gorhom/bottom-sheet) -- v5.2.8, peer deps: `react-native-reanimated: ">=3.16.0 || >=4.0.0-"`
- [@gorhom/bottom-sheet Reanimated v4 issue #2546](https://github.com/gorhom/react-native-bottom-sheet/issues/2546) -- compatibility confirmed in v5.1.8+
- [Reanimated Marquee example](https://docs.swmansion.com/react-native-reanimated/examples/marquee/) -- useFrameCallback pattern
- [Expo SDK 55 changelog](https://expo.dev/changelog/sdk-55) -- NativeTabs availability

---

*Stack research for v1.1 milestone: 2026-03-09*
*Supersedes v1.0 STACK.md research*

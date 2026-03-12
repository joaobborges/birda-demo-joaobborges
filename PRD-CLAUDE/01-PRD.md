# Birda — Product Requirements Document

**Version:** 0.4 (Interview Prototype — Production-Ready Architecture)
**Date:** March 2026
**Author:** João Borges
**Stack:** Expo (SDK 52+) + React Native + EAS Dev Client
**Scope:** Interview demo prototype — local data only, no API, no backend
**Philosophy:** Prototype scope, production-grade architecture. Every pattern, config, and convention is chosen so the codebase can ship to the App Store with minimal changes when a backend is added.

---

## 1. Overview

Birda is a bird watching companion app that helps users discover, log, and share bird sightings. This prototype demonstrates three key areas:

1. A polished multi-step onboarding flow with user profiling
2. A paywall with a standard plan and a special Nature Day discount trigger
3. A map-based home screen with zoom-dependent bird visibility

All data is local — no endpoints, no authentication backend.

---

## 2. Design Principles

- **Playful but purposeful** — rounded corners, smooth transitions, friendly copy
- **Mobile-first** — optimised for iOS, runs on EAS development build
- **Pragmatic** — only core interactions need to work; no over-engineering
- **Fast to build** — local state, mock data, clean reusable components

> **Note:** This app requires an EAS development build (not Expo Go) due to `react-native-maps`. Run via `npx expo run:ios` or `eas build --profile development`.

---

## 3. App Structure

### File-based routing (Expo Router)
```
app/
├── _layout.tsx                  # Root layout — providers + onboarding gate
├── (onboarding)/                # Onboarding flow group
│   ├── _layout.tsx              # Stack with back gesture disabled
│   ├── welcome.tsx
│   ├── name.tsx
│   ├── location.tsx
│   ├── skill-level.tsx
│   ├── interests.tsx
│   ├── notifications.tsx
│   ├── summary.tsx
│   └── paywall.tsx
├── (main)/                      # Main app group
│   ├── _layout.tsx              # Map screen layout (no tab navigator)
│   ├── index.tsx                # Full-bleed map with floating UI
│   ├── profile.tsx              # Modal presentation
│   └── community.tsx            # Modal presentation
src/
├── components/
│   ├── ui/                      # Reusable UI (Button, Card, etc.)
│   ├── map/                     # MapView, BirdMarker, BirdInfoCard
│   ├── onboarding/              # Step components, ProgressDots
│   └── dev/                     # __DEV__-only debug panel (tree-shaken in prod)
│       ├── DevPanel.tsx
│       ├── DevPanelTrigger.tsx
│       └── dev-actions.ts
├── stores/                      # Zustand stores
│   └── onboarding.ts
├── data/                        # Mock bird JSON
├── hooks/                       # Custom hooks
├── utils/                       # Helpers
└── types/                       # TypeScript types
```

---

## 4. Onboarding Flow

### Goal
Collect user info to personalise the experience and increase paywall conversion. Deep onboarding engagement correlates with higher retention and conversion rates.

### Navigation Strategy
The onboarding uses a **native stack with gestures disabled** to prevent swipe-back and enforce a linear wizard flow. Each screen transitions via native `slide_from_right` animation.

```typescript
// app/(onboarding)/_layout.tsx
<Stack screenOptions={{
  gestureEnabled: false,
  headerShown: false,
  animation: 'slide_from_right',
}} />
```

### Screens

| # | Screen | Content |
|---|--------|---------|
| 1 | Welcome | Logo, tagline, CTA to start |
| 2 | Name | "What should we call you?" — text input |
| 3 | Location | Location permission or manual city input |
| 4 | Skill Level | Beginner / Intermediate / Advanced — single select |
| 5 | Bird Interests | Raptors, songbirds, waterbirds, etc — multi-select |
| 6 | Notifications | Alert preferences — toggles |
| 7 | Profile Summary | Recap of selections before paywall |

### Behaviour
- Progress indicator throughout (dots or step counter)
- Each screen has a "Continue" CTA and a subtle "Skip" option
- Data managed via **Zustand store with AsyncStorage persistence** (see Section 8)
- Animated transitions via `react-native-reanimated` for in-screen elements (fade-in content, button spring effects)
- Native stack transitions between screens (no JS-driven page animation)
- **Name input** uses an **uncontrolled `TextInput`** — store the value in a ref and only commit to Zustand on "Continue" press. This avoids a re-render on every keystroke.

```typescript
// Uncontrolled TextInput pattern for onboarding name screen
const nameRef = useRef('')

<TextInput
  defaultValue={nameRef.current}
  onChangeText={(text) => { nameRef.current = text }}
/>

// On "Continue" press:
useOnboardingStore.getState().setName(nameRef.current)
```

### State Management

```typescript
// stores/onboarding.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface OnboardingState {
  name: string
  location: string | null
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | null
  interests: string[]
  completed: boolean
  setName: (name: string) => void
  setLocation: (location: string) => void
  setSkillLevel: (level: OnboardingState['skillLevel']) => void
  setInterests: (interests: string[]) => void
  completeOnboarding: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      name: '',
      location: null,
      skillLevel: null,
      interests: [],
      completed: false,
      setName: (name) => set({ name }),
      setLocation: (location) => set({ location }),
      setSkillLevel: (skillLevel) => set({ skillLevel }),
      setInterests: (interests) => set({ interests }),
      completeOnboarding: () => set({ completed: true }),
      reset: () => set({
        name: '', location: null, skillLevel: null,
        interests: [], completed: false,
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

---

## 5. Paywall

### Standard Paywall

Shown at the end of onboarding.

- Headline referencing user's name or skill level (read from Zustand store)
- 3–4 key feature benefits
- Monthly vs Annual toggle (annual highlighted as best value)
- Toggle animation via `react-native-reanimated` (`withSpring`)
- CTA: "Start Free Trial" — with haptic feedback (`expo-haptics`)
- **CTA button press animation** uses `GestureDetector` + `Gesture.Tap()` (not `Pressable` callbacks) — press animations run entirely on the UI thread with no JS round-trip
- Subtle "Continue with free plan" link

### Nature Day Discount Variant

Triggered manually via debug menu for demo purposes.

- Nature Day banner
- 20% off pricing prominently displayed
- Urgency copy: *"Today only — celebrate Nature Day with 20% off"*
- CTA: "Claim My Discount"

### Debug Panel

Expo's built-in dev menu (shake / Cmd+D) **cannot be extended with custom options**. We need a custom debug panel.

**Implementation:** A `__DEV__`-only component that is completely tree-shaken from production builds. Renders as a floating draggable button that opens a form sheet with custom actions.

```
src/components/dev/
├── DevPanel.tsx           # Main panel — only imported behind __DEV__ check
├── DevPanelTrigger.tsx    # Floating button overlay
└── dev-actions.ts         # Action definitions
```

**Mounting strategy** — conditionally imported in root layout so it never touches the production bundle:

```typescript
// app/_layout.tsx
const DevPanel = __DEV__ ? require('@/components/dev/DevPanel').default : null

export default function RootLayout() {
  return (
    <>
      <Providers>
        <Stack />
      </Providers>
      {DevPanel ? <DevPanel /> : null}
    </>
  )
}
```

**Panel options:**

| Action | What it does |
|--------|-------------|
| Trigger Nature Day Paywall | Navigates to paywall with `variant: 'nature-day'` param |
| Reset Onboarding | Calls `useOnboardingStore.getState().reset()` + navigates to welcome |
| Go to Map | `router.replace('/(main)')` |
| Show Zustand State | Dumps current store state as formatted JSON |
| Toggle FPS Monitor | Shows/hides a real-time FPS overlay using Reanimated's `useFrameCallback` (measures actual frame time on the UI thread — more accurate than the built-in Perf Monitor) |
| Clear AsyncStorage | Wipes all persisted data for fresh state |

**UI:** Native form sheet presentation (`<Modal presentationStyle="formSheet">`) — consistent with the app's modal pattern. The floating trigger button is absolute-positioned, semi-transparent, and draggable via `PanGesture` so it never blocks content.

---

## 6. Home Screen (Map)

### Layout
```
┌──────────────────────────────┐
│ [Profile]   [Community] [bell] │  floating icons (absolute positioned)
│                              │
│        FULL SCREEN MAP       │
│   [Bird pins — zoom-based]   │
│                              │
│  [  Capture  ]  [ Logbook ]  │  custom bottom bar (absolute positioned)
└──────────────────────────────┘
```

### Important: This is NOT a Tab Navigator

The Home screen is a **single full-bleed map screen** with custom floating UI elements positioned absolutely. There is no `@react-navigation/bottom-tabs` — the bottom bar and floating icons are plain `Pressable` components overlaid on the map.

- Floating icons use `useSafeAreaInsets()` for correct positioning on all devices
- Profile and Community open as **native form sheet presentations** via `router.push()` — provides native swipe-to-dismiss, keyboard avoidance, and accessibility out of the box
- Bottom buttons are visual-only — no navigation wired

```typescript
// app/(main)/_layout.tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="profile" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0] }} />
  <Stack.Screen name="community" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75, 1.0] }} />
</Stack>
```

### Map Behaviour

- Built with `react-native-maps` (MapView) — **requires EAS dev client build**
- Zoom-based bird visibility:
  - **Zoomed out** → common species only
  - **Zoomed in** → rarer species appear progressively
- Mock bird data (local JSON) — **capped at ~30–50 entries** for performance
- Use `react-native-map-clustering` for automatic marker clustering at lower zoom levels
- Custom marker components wrapped in `React.memo` to prevent re-render jank
- Tapping a pin shows a minimal bird info card (name, species, photo)
- Bird photos rendered with `expo-image` (caching, blurhash placeholders)
- Status bar set to `translucent` for full-bleed map experience

### Map Performance Rules
- Memoize all marker components with `React.memo`
- Extract `onPress` handlers outside render — stabilize with `useCallback`
- Never pass inline style objects to markers
- Use `expo-image` instead of `<Image>` for bird photos in info cards

### Navigation Elements

| Element | Position | Implementation |
|---------|----------|----------------|
| Profile icon | Top left, floating | `Pressable` + `useSafeAreaInsets()` → `router.push('/profile')` |
| Community icon | Top right, floating | `Pressable` + `useSafeAreaInsets()` → `router.push('/community')` |
| Notifications icon | Top right, floating | Badge only — no action |
| Capture button | Bottom left | Visual only — no action |
| Logbook button | Bottom right | Visual only — no action |

---

## 7. Supporting Screens

### Profile (Form Sheet)
- Avatar placeholder (rendered with `expo-image`)
- Username + skill level badge (read from Zustand store)
- Achievement badges (3–5 mock)
- Bird count stats (mock numbers)

### Community (Form Sheet)
- Feed of recent mock sightings
- Rendered with **LegendList** (`@legendapp/list`) for smooth scrolling — preferred over FlashList for simpler API and better defaults
- Each entry: bird photo (`expo-image`), species name, username, location, timestamp

---

## 8. Technical Stack

| Tool | Purpose |
|------|---------|
| Expo SDK 52+ | App shell and device APIs |
| Expo Router | File-based navigation (built on React Navigation) |
| react-native-maps | Map screen (requires dev client) |
| react-native-map-clustering | Marker clustering at low zoom levels |
| react-native-reanimated | Animations — native thread, 60fps |
| react-native-gesture-handler | Gesture interactions |
| Zustand + AsyncStorage | State management + persistence |
| expo-image | All image rendering (replaces `<Image>`) |
| expo-haptics | Tactile feedback on CTA buttons |
| babel-plugin-react-compiler | Auto-memoization — eliminates manual memo/useCallback |
| expo-font (config plugin) | Custom fonts via `app.json` — no runtime loading |
| expo-status-bar | Translucent status bar for map |
| @legendapp/list (LegendList) | Community feed list (preferred over FlashList) |
| Local JSON | Mock bird data (~30–50 entries) |

No API calls. No authentication. No backend.

### React Compiler
- Enable `babel-plugin-react-compiler` — auto-memoizes components and hooks, eliminating manual `memo()`, `useMemo()`, and `useCallback()` in most cases
- **Destructure functions from hooks at top of render** — e.g. `const { push } = useRouter()` not `router.push()`. Destructured functions are stable references; dotting into objects breaks compiler cache keys.

### Import Rules (CRITICAL)
- **Never use barrel imports** — import directly from source files, not from `index.ts` re-exports
- Barrel imports force Metro to evaluate ALL exports even if you only use one, bloating the bundle and slowing TTI
- Enforce with `eslint-plugin-no-barrel-files`

```typescript
// BAD — loads entire components barrel
import { Button } from '@/components'

// GOOD — loads only Button
import { Button } from '@/components/ui/Button'
```

---

## 9. Build & Release Configuration

### EAS Build Profiles

```json
// eas.json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "env": { "APP_VARIANT": "development" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": { "APP_VARIANT": "preview" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "APP_VARIANT": "production" }
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "your@email.com", "ascAppId": "YOUR_APP_ID" },
      "android": { "serviceAccountKeyPath": "./google-services.json" }
    }
  }
}
```

### Build Commands

```bash
# Development (local device testing)
npx expo run:ios
# or remote
eas build --profile development --platform ios

# Preview (internal testers)
eas build --profile preview --platform all

# Production (store submission)
eas build --profile production --platform all
eas submit --platform all

# OTA update (skip store review for JS-only changes)
eas update --branch production --message "Bug fixes"
```

### Bundle Optimization

These are configured once and apply to all production builds:

| Optimization | Config | Impact |
|-------------|--------|--------|
| **Tree shaking** | `.env`: `EXPO_UNSTABLE_TREE_SHAKING=1` + `EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1` | 10-15% bundle reduction |
| **Hermes mmap (Android)** | Disable JS bundle compression in `android/app/build.gradle` | Faster cold start TTI |
| **R8 shrinking (Android)** | `enableProguardInReleaseBuilds = true` + `shrinkResources true` | ~30% APK size reduction |
| **iOS Asset Catalog** | `EXTRA_PACKAGER_ARGS="--asset-catalog-dest ./"` in Xcode build phase | ~40% image size reduction per device |
| **16KB alignment (Android)** | Verify with `zipalign -c -P 16 -v 4 app-release.apk` | Required for Google Play (Android 15+) |

### Metro Config

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
})

module.exports = config
```

```bash
# .env (production optimizations)
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

---

## 10. Error Handling

### Critical Rendering Rules
These prevent **production crashes** in React Native:

1. **Never use `&&` with potentially falsy values** — `{count && <Text>...</Text>}` crashes if `count` is `0`. Use ternary: `{count > 0 ? <Text>...</Text> : null}`
2. **Always wrap strings in `<Text>`** — bare strings inside `<View>` crash the app
3. Enable **`react/jsx-no-leaked-render`** ESLint rule to catch rule #1 automatically

### Error Boundary
Wrap the map screen and main app in Expo Router's built-in error boundary to prevent full-app crashes (maps are crash-prone on Android):

```typescript
// app/(main)/index.tsx
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.errorContainer}>
      <Text>Something went wrong loading the map.</Text>
      <Button title="Try Again" onPress={retry} />
    </View>
  )
}
```

---

## 11. Animation Strategy

All animations use `react-native-reanimated` running on the native thread for 60fps.

| Where | Animation | Technique |
|-------|-----------|-----------|
| Onboarding screen content | Fade in on mount | `FadeIn` entering animation |
| Continue / CTA buttons | Spring press feedback | `useAnimatedStyle` + `withSpring(0.95)` on press |
| Paywall plan toggle | Smooth switch | `withSpring` on layout transition |
| Bird info card | Slide up from bottom | `SlideInUp` entering animation |
| Map markers | Subtle scale on appear | `FadeIn.delay()` + `ZoomIn` |

**Critical rule:** Only animate `transform` and `opacity` — these properties run on the GPU. Never animate `width`, `height`, `margin`, or `padding`.

### Button Press Animation Pattern

Use `GestureDetector` + `Gesture.Tap()` for animated press states — runs entirely on the UI thread:

```typescript
const pressed = useSharedValue(0)

const tap = Gesture.Tap()
  .onBegin(() => { pressed.set(withTiming(1)) })
  .onFinalize(() => { pressed.set(withTiming(0)) })
  .onEnd(() => { runOnJS(onPress)() })

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}))
```

---

## 12. Styling Conventions

Follow these patterns for consistent, performant styling across the app:

| Pattern | Rule |
|---------|------|
| **Border radius** | Always pair with `borderCurve: 'continuous'` for smooth iOS corners |
| **Spacing between siblings** | Use `gap` on parent, not `margin` on children |
| **Spacing within** | Use `padding` for internal space |
| **Shadows** | Use CSS `boxShadow` syntax: `'0 2px 8px rgba(0,0,0,0.1)'` |
| **Gradients** | Use `experimental_backgroundImage: 'linear-gradient(...)'` — no third-party lib needed |
| **Font hierarchy** | Limit font sizes. Use `fontWeight` and color opacity for visual hierarchy instead |

```typescript
// Example: consistent card style
const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
})

---

## 13. ESLint Configuration

Production-ready linting to catch crashes and enforce conventions:

```javascript
// eslint.config.js — key rules
{
  rules: {
    'react/jsx-no-leaked-render': 'error',        // Prevent && crash with falsy values
    'no-barrel-files/no-barrel-files': 'error',    // Enforce direct imports
  }
}
```

**Required plugins:**
- `eslint-plugin-react` — JSX safety rules
- `eslint-plugin-no-barrel-files` — barrel import prevention

---

## 14. Scope

### In Scope
- Onboarding (7 screens) with disabled back gesture
- Standard paywall with animated toggle
- Nature Day paywall (debug-triggered via custom debug panel)
- Custom debug panel with FPS monitor, state inspector, and action shortcuts
- Map with zoom-based bird logic + marker clustering
- Profile screen (form sheet, static data)
- Community screen (form sheet, LegendList feed)
- Custom floating UI on map (not a tab navigator)
- Error boundaries on crash-prone screens
- EAS build profiles (development, preview, production)
- Production bundle optimizations (tree shaking, R8, asset catalog, Hermes mmap)
- Metro config with experimental import support
- ESLint rules for crash prevention and import hygiene
- React Compiler for auto-memoization

### Out of Scope
- Expo Go support (maps require native modules)
- Real authentication or backend
- Capture flow
- Logbook functionality
- Push notifications
- Payment processing
- CI/CD pipeline (EAS config is ready, pipeline wiring is deferred)
- Automated testing (architecture supports it, tests are deferred)

---

## 15. Production Readiness Checklist

When transitioning from prototype to production, these are already done vs. deferred:

| Area | Status | Notes |
|------|--------|-------|
| Navigation (Expo Router) | Done | File-based, native stack |
| State management (Zustand) | Done | Persisted, atomic |
| Animations (Reanimated) | Done | GPU-only, UI thread |
| Error boundaries | Done | Map + root |
| Tree shaking | Done | Metro config + .env |
| R8 shrinking (Android) | Done | build.gradle config |
| Hermes mmap (Android) | Done | Bundle decompression disabled |
| iOS Asset Catalog | Done | Build phase configured |
| 16KB alignment check | Done | zipalign in release flow |
| React Compiler | Done | Auto-memoization |
| ESLint crash rules | Done | jsx-no-leaked-render + no-barrel |
| EAS profiles | Done | dev / preview / production |
| OTA updates | Ready | `eas update` configured |
| Debug panel | Done | `__DEV__`-only, tree-shaken |
| Real API layer | Deferred | Replace local JSON with React Query |
| Authentication | Deferred | Add expo-secure-store + auth provider |
| Push notifications | Deferred | Add expo-notifications |
| Payment processing | Deferred | Add RevenueCat or similar |
| CI/CD pipeline | Deferred | Wire EAS to GitHub Actions |
| Automated tests | Deferred | Jest + React Native Testing Library |
| Accessibility audit | Deferred | VoiceOver/TalkBack pass |

---

## 16. Success Criteria

1. Smooth, polished onboarding experience with native transitions
2. Compelling paywall with clear Nature Day variant and spring animations
3. Functional map with zoom-based bird filtering and marker clustering
4. Feels like a real product — not a rough wireframe
5. Runs live on device without crashing (error boundaries in place)
6. Consistent 60fps during animations and map interactions
7. Debug panel accessible in dev builds with all custom actions working
8. Production build passes: tree shaking enabled, R8 shrinking active, 16KB aligned
9. Codebase follows all import, styling, and rendering conventions documented in this PRD

---

*PRD v0.4 — Birda Interview Prototype (Production-Ready Architecture) — March 2026*
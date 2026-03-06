# Architecture

**Analysis Date:** 2026-03-06

## Pattern Overview

**Overall:** File-based routing mobile app (Expo Router) with Zustand state management

**Key Characteristics:**
- Expo Router file-based navigation with route groups `(onboarding)` and `(main)`
- Zustand stores for persistent client-side state (persisted via AsyncStorage)
- Static/hardcoded data layer (no backend API)
- Screen-level components with co-located styles (React Native StyleSheet)
- Reanimated-powered animations throughout

## Layers

**Routing Layer (app/):**
- Purpose: Defines navigation structure and screen components via file-based routing
- Location: `app/`
- Contains: Layout files (`_layout.tsx`), screen components, route groups
- Depends on: `src/stores/`, `src/components/`, `src/data/`
- Used by: Expo Router framework (automatic)

**State Layer (src/stores/):**
- Purpose: Global state management with persistence
- Location: `src/stores/`
- Contains: Zustand stores with persist middleware
- Depends on: `@react-native-async-storage/async-storage`, `zustand`
- Used by: Screen components in `app/`, DevPanel

**Data Layer (src/data/):**
- Purpose: Static application data (bird catalog)
- Location: `src/data/`
- Contains: Typed constant arrays and TypeScript interfaces
- Depends on: Nothing
- Used by: `app/(main)/index.tsx` (map screen)

**Component Layer (src/components/):**
- Purpose: Reusable UI components shared across screens
- Location: `src/components/`
- Contains: UI primitives (`ui/`), feature-specific components (`onboarding/`), dev tools (`dev/`)
- Depends on: `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`
- Used by: Screen components in `app/`

## Data Flow

**Onboarding Flow:**

1. `app/index.tsx` checks `useOnboardingStore().completed` to decide routing
2. If not completed, redirects to `/(onboarding)/welcome`
3. User progresses through: welcome -> name -> location -> skill-level -> interests -> notifications -> summary -> paywall
4. Each step writes to `useOnboardingStore` via setter methods (e.g., `setName`, `setSkillLevel`)
5. Store persists to AsyncStorage under key `onboarding-storage`
6. Paywall screen calls `completeOnboarding()` and replaces to `/(main)`

**Map Interaction Flow:**

1. `app/(main)/index.tsx` renders `MapView` with initial Lisbon region
2. `onRegionChangeComplete` updates local `region` state
3. `getVisibleBirds(region)` filters `birds` array based on zoom level (longitude delta)
4. Bird markers render on map; tapping sets `selectedBird` local state
5. `BirdInfoCard` slides up with bird details when selected

**State Management:**
- **Global persistent state:** Zustand with `persist` middleware + AsyncStorage (onboarding data)
- **Local screen state:** React `useState` for UI state (selected bird, notification toggles, plan selection)
- **Uncontrolled refs:** `useRef` for text inputs in onboarding (name, location) to avoid re-renders

## Key Abstractions

**Bird:**
- Purpose: Represents a bird species with location data for map display
- Definition: `src/data/birds.ts` (exported interface `Bird`)
- Fields: `id`, `name`, `species`, `rarity` (common/uncommon/rare), `latitude`, `longitude`, `image`, `description`
- Used by: `app/(main)/index.tsx`

**OnboardingState:**
- Purpose: Tracks user onboarding progress and preferences
- Definition: `src/stores/onboarding.ts` (interface `OnboardingState`)
- Fields: `name`, `location`, `skillLevel`, `interests`, `completed`
- Setters: `setName`, `setLocation`, `setSkillLevel`, `setInterests`, `completeOnboarding`, `reset`

**Button:**
- Purpose: Primary interactive element with haptic feedback and press animation
- Definition: `src/components/ui/Button.tsx`
- Variants: `primary`, `secondary`, `link`
- Pattern: Gesture Handler tap with Reanimated scale animation + Haptics

**ProgressDots:**
- Purpose: Visual step indicator for onboarding flow
- Definition: `src/components/onboarding/ProgressDots.tsx`
- Props: `total` (number of steps), `current` (active step index)

## Entry Points

**App Entry:**
- Location: `app/_layout.tsx` (root layout)
- Triggers: App launch (Expo Router reads `"main": "expo-router/entry"` from `package.json`)
- Responsibilities: Wraps app in `GestureHandlerRootView`, sets `StatusBar`, renders `Stack` navigator, conditionally mounts `DevPanel` in `__DEV__`

**Root Index (Router):**
- Location: `app/index.tsx`
- Triggers: Initial navigation
- Responsibilities: Reads `completed` from onboarding store, redirects to `/(main)` or `/(onboarding)/welcome`

**Onboarding Entry:**
- Location: `app/(onboarding)/welcome.tsx`
- Triggers: First app launch (onboarding not completed)
- Responsibilities: Welcome screen with "Get Started" button

**Main App Entry:**
- Location: `app/(main)/index.tsx`
- Triggers: Onboarding completed
- Responsibilities: Map screen with bird markers, floating UI bars, bird info cards

## Error Handling

**Strategy:** Minimal -- Expo Router ErrorBoundary pattern on map screen only

**Patterns:**
- `app/(main)/index.tsx` exports an `ErrorBoundary` component that catches map loading errors and provides a retry button
- No try/catch blocks in store actions or data layer
- No global error boundary beyond what Expo Router provides by default

## Cross-Cutting Concerns

**Logging:** None (no logging framework, no console.log calls in source)

**Validation:** None -- onboarding inputs are optional (skip buttons on every step), no validation applied

**Authentication:** None -- no auth system exists

**Navigation Guards:** `app/index.tsx` acts as a simple redirect guard based on `onboarding.completed` boolean

**Animations:** Pervasive use of `react-native-reanimated` (`FadeIn`, `FadeInDown`, `SlideInDown`, `withSpring`, `withTiming`) and `react-native-gesture-handler` for press interactions

**Safe Areas:** Every screen uses `useSafeAreaInsets()` from `react-native-safe-area-context` to adjust padding

**Dev Tools:** `src/components/dev/DevPanel.tsx` mounts only in `__DEV__` mode via conditional require in root layout. Provides: reset onboarding, navigate to map, trigger paywall variant, show Zustand state, clear AsyncStorage.

---

*Architecture analysis: 2026-03-06*

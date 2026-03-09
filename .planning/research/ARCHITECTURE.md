# Architecture Patterns: v1.1 Polish & Refinement

**Domain:** Bird watching mobile app prototype — integration architecture for new features
**Researched:** 2026-03-09
**Confidence:** HIGH (existing codebase fully analyzed, official docs verified for key APIs)

## Current Architecture Snapshot

```
Root Layout (GestureHandlerRootView + SplashScreen guard + DevPanel)
├── app/index.tsx — Redirect guard (completed → main, else → onboarding)
├── (onboarding)/ Stack [animation: 'fade', gestureEnabled: false]
│   ├── welcome.tsx (illustration + terms + Create/Login CTAs)
│   ├── ai-bird-id.tsx → birding-journey.tsx → name.tsx → ... → paywall.tsx → reminders.tsx → mailing-list.tsx
│   └── 12 screens total, linear wizard, OnboardingLayout shared component
├── (main)/ Stack
│   ├── index.tsx — Full-bleed MapView + floating UI (top bar + bottom bar)
│   ├── profile.tsx — Push screen (not formSheet currently)
│   └── community.tsx — Push screen (not formSheet currently)
```

**Key existing patterns:**
- OnboardingLayout: illustration slot + ScrollView body + pinned footer
- Button: GestureDetector + Gesture.Tap() + Reanimated (UI thread only)
- Theme tokens exist in src/theme/ but most screens use hardcoded values
- Rubik font declared in typography.ts but never loaded via expo-font
- SplashScreen.preventAutoHideAsync() already in root layout, hides after Zustand hydration

---

## Feature Integration Architecture

### 1. Splash Screen — app.json Config Plugin

**Type:** MODIFIED (app.json + existing root layout)

**Current state:** `expo-splash-screen` is already a plugin in app.json and the API is already used in `app/_layout.tsx` (preventAutoHideAsync/hideAsync after hydration). The splash config uses the legacy `splash` key with `splash-icon.png`.

**Integration approach:** Configure via the `expo-splash-screen` config plugin in app.json. This is the recommended approach for SDK 55 — the plugin generates native splash screen assets at build time.

```jsonc
// app.json — replace current splash + plugin entries
{
  "expo": {
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "plugins": [
      "expo-router",
      "expo-image",
      "expo-font",
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash-icon.png",
          "backgroundColor": "#FFFFFF",
          "imageWidth": 200
        }
      ]
    ]
  }
}
```

**What changes:**
- `app.json`: Update `expo-splash-screen` plugin entry from bare string to array with config object
- `app/_layout.tsx`: No changes needed — existing preventAutoHideAsync/hideAsync flow is correct
- Requires: New EAS dev build after config change (config plugin = native change)

**What does NOT change:**
- Root layout hydration guard logic
- SplashScreen.hideAsync() timing

**Confidence:** HIGH — expo-splash-screen config plugin is documented for SDK 55. The `imageWidth` default is 100; 200 is the max recommended value.

**Caveat:** Cannot test splash screen accurately in dev builds. Must use preview/production build to verify appearance.

---

### 2. Mosaic Animation Component — Welcome Screen Illustration Slot

**Type:** NEW component (`src/components/onboarding/MosaicAnimation.tsx`)

**Where in component tree:** Replaces the empty `<View style={styles.illustration} />` passed as the `illustration` prop of `OnboardingLayout` on the welcome screen.

```
welcome.tsx
└── OnboardingLayout
    ├── illustration={<MosaicAnimation />}  ← NEW (replaces empty View)
    ├── children (heading + checkbox)
    └── footer (Create Account + Log in buttons)
```

**Architecture approach:** Self-contained Reanimated component. No external state, no store interaction. Pure visual effect.

```typescript
// src/components/onboarding/MosaicAnimation.tsx
// Auto-scrolling grid of bird images that loops infinitely

interface MosaicAnimationProps {
  height: number  // Passed from welcome screen (screenHeight * 0.45)
}
```

**Implementation pattern — column-based vertical scroll:**
- Render 3-4 columns of bird images (use expo-image for performant image loading)
- Each column auto-scrolls vertically at different speeds using Reanimated `withRepeat(withTiming(...))` on translateY
- Alternate columns scroll in opposite directions for visual interest
- Images arranged in a fixed grid, no FlatList needed (static content, no recycling)
- Wrap content so the scroll appears infinite (duplicate the image set)

**Key constraints (60fps mandate):**
- Animate ONLY translateY (GPU property) on the column containers
- Use `useSharedValue` + `useAnimatedStyle` — no `useState` for scroll position
- Images must be pre-sized (no layout measurement during animation)
- Use `expo-image` (already installed) with `cachePolicy="memory-disk"` for instant loads
- No `Animated.ScrollView` — use raw translateY animation for smoother control

**Interaction with welcome screen layout:**
- MosaicAnimation is self-contained, receives only `height` prop
- OnboardingLayout's `illustrationZone` has `position: relative` — the mosaic fills this zone
- Content below (heading, checkbox, buttons) is unaffected — OnboardingLayout's ScrollView handles body
- The mosaic should have `overflow: 'hidden'` on its container to clip at the illustration boundary
- Consider a gradient overlay (LinearGradient) at the bottom edge to fade into the white content area

**Welcome screen also needs layout lock:**
- The welcome screen currently has a scrollable body — for v1.1 the requirement says "locked layout"
- This means removing the ScrollView behavior for welcome specifically, or making the body non-scrollable
- OnboardingLayout accepts `illustration` as a render prop slot — the layout itself does not need modification for the mosaic

**Data source:** Bird images from `src/data/birds.ts` (each bird entry likely has an image/emoji). If real bird images are needed, add them to `src/assets/birds/` as static requires.

---

### 3. Bottom Sheet — Custom Reanimated Component (NOT gorhom)

**Type:** NEW component (`src/components/ui/BottomSheet.tsx`)

**CRITICAL FINDING: @gorhom/bottom-sheet is NOT compatible with Reanimated v4.**

The project uses `react-native-reanimated@4.2.1`. gorhom/bottom-sheet v5 officially supports Reanimated v1-3 only. Multiple GitHub issues confirm the bottom sheet fails to open or animate with Reanimated v4. There is no official fix as of March 2026.

**Recommended approach:** Build a custom bottom sheet using Reanimated v4 + Gesture Handler v2 (both already installed). The Reanimated docs provide an official bottom sheet example compatible with v4.

```typescript
// src/components/ui/BottomSheet.tsx
interface BottomSheetProps {
  isOpen: SharedValue<boolean>
  children: ReactNode
  snapPoints?: number[]  // e.g., [0.5, 0.9] as fractions of screen height
  onClose?: () => void
}
```

**Implementation essentials:**
- `Gesture.Pan()` for drag-to-dismiss (runs on UI thread via GestureDetector)
- `useSharedValue` for translateY position
- `withSpring` for snap-to-detent animation
- Backdrop overlay with animated opacity (tap-to-dismiss)
- `useSafeAreaInsets()` for bottom padding
- `useAnimatedStyle` for transform + opacity

**Shared component for two use cases:**

| Use Case | Trigger | Content | Snap Points |
|----------|---------|---------|-------------|
| Auth Drawer | "Create Account" or "Log in" on welcome | Apple/Google/Email sign-in buttons | Single detent (~40% screen) |
| Map Drawer | Swipe-up or button on map screen | Full-width content, rendered above all | [0.5, 0.95] of screen |

**Component tree — Auth Drawer:**
```
welcome.tsx
└── OnboardingLayout
    ├── illustration={<MosaicAnimation />}
    ├── children (heading + checkbox)
    └── footer
        ├── Button "Create Account" → opens auth bottom sheet
        └── Button "Log in" → opens auth bottom sheet (different mode)
└── BottomSheet isOpen={authSheetOpen}  ← Rendered OUTSIDE OnboardingLayout
    └── AuthDrawerContent (Apple, Google, Email buttons)
```

**Why outside OnboardingLayout:** The bottom sheet must overlay the entire screen including the illustration. OnboardingLayout's ScrollView would clip it. Render it as a sibling at the root of the welcome screen's return value.

**Component tree — Map Drawer:**
```
(main)/index.tsx
└── View (container)
    ├── MapView
    ├── Floating top bar
    ├── Floating bottom bar
    ├── BirdInfoCard (conditional)
    └── BottomSheet isOpen={mapDrawerOpen}  ← Rendered last (above all)
        └── MapDrawerContent
```

**Portal approach: NOT needed.** Both use cases render the bottom sheet within the screen component's own tree, positioned absolutely to cover the full screen. Since there is no tab navigator, there is no z-index layering issue that would require a portal.

**Data flow:** The bottom sheet is purely UI state — controlled by a `useSharedValue<boolean>` (or `useState` for open/closed if triggering from JS). No store changes needed.

**Confidence:** HIGH for custom implementation feasibility — the project already uses Gesture.Pan() patterns (Button uses Gesture.Tap()) and Reanimated shared values everywhere. The team has proven competency with these APIs. LOW confidence for gorhom compatibility — explicitly avoid it.

---

### 4. Paywall Redesign — Replace Existing Screen In-Place

**Type:** MODIFIED (`app/(onboarding)/paywall.tsx`)

**Current flow:** welcome → ai-bird-id → ... → paywall → reminders → mailing-list (completes onboarding)

**New behavior changes:**
1. **Visual redesign** — hero image at top, bullet-point features, pricing cards (replaces current toggle)
2. **Close/dismiss navigates to home** — currently paywall "Continue with free plan" goes to reminders; new behavior should skip remaining onboarding and go to `/(main)`
3. **Remove plan toggle** — replace with simpler pricing card layout

**Navigation change — dismiss to home:**
```typescript
// Current: handleFree navigates forward in onboarding
const handleFree = () => {
  push('/(onboarding)/reminders')
}

// New: dismiss skips to home
const handleDismiss = () => {
  completeOnboarding()  // Sets completed: true in Zustand
  router.replace('/(main)')  // Replace, not push — clears onboarding stack
}
```

**Important:** Use `router.replace()` not `router.push()`. Using replace prevents the user from swiping back into the onboarding flow after dismissing the paywall. The `completeOnboarding()` call ensures the redirect guard in `app/index.tsx` will route to `/(main)` on future app launches.

**What changes:**
- `app/(onboarding)/paywall.tsx`: Complete rewrite of JSX/styles. Keep OnboardingLayout wrapper. Replace toggle with pricing cards. Add X close button. Wire dismiss to `completeOnboarding() + replace('/(main)')`.
- `src/stores/onboarding.ts`: No changes — `completeOnboarding` action already exists.
- OnboardingLayout: No changes — the paywall still uses illustration + footer slots.

**What does NOT change:**
- Onboarding flow order (paywall is still at the same position)
- Store shape or persistence
- Other onboarding screens
- Nature Day variant support (keep `useLocalSearchParams`)

**Close button pattern:**
```typescript
// header prop of OnboardingLayout — positions in top-right of illustration zone
header={
  <Pressable onPress={handleDismiss} style={styles.closeButton}>
    <Ionicons name="close" size={24} color={semantic.textPrimary} />
  </Pressable>
}
```

OnboardingLayout already supports a `header` prop that renders as an absolute overlay on the illustration zone at `top: top + 12`. Use this for the close/X button — no layout changes needed.

---

### 5. Native Tab Bar on Home — Coexist with Floating UI (Partially Replace)

**Type:** MODIFIED (`app/(main)/_layout.tsx` + `app/(main)/index.tsx`)

**Key decision: The native tab bar REPLACES the floating bottom bar (Capture/Logbook), but the floating TOP bar (profile, community, notifications) stays.**

**Rationale:**
- The floating bottom bar currently has Capture and Logbook buttons — these are the tabs
- The floating top bar has profile/community/notifications — these are contextual actions on the map, not navigation destinations
- A native tab bar provides correct iOS behavior (haptics, accessibility, system-standard placement)
- Having BOTH a floating bottom bar AND a native tab bar would be visually confusing and waste space

**Implementation with Expo Router Native Tabs:**

The `expo-router/unstable-native-tabs` API is available in SDK 55. It uses `UITabBarController` on iOS for genuine native tabs.

```
app/(main)/
├── _layout.tsx  ← CHANGED: NativeTabs layout instead of Stack
├── index.tsx    ← Map screen (tab 1, default)
├── capture.tsx  ← NEW: Capture tab screen (placeholder)
├── logbook.tsx  ← NEW: Logbook tab screen (placeholder)
├── profile.tsx  ← Stays as push screen from map
└── community.tsx ← Stays as push screen from map
```

**Layout change:**
```typescript
// app/(main)/_layout.tsx — BEFORE (Stack)
import { Stack } from 'expo-router'
export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }}>...</Stack>
}

// app/(main)/_layout.tsx — AFTER (NativeTabs wrapping Stack screens)
import { NativeTabs } from 'expo-router/unstable-native-tabs'
export default function MainLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="map.fill" />
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="capture">
        <NativeTabs.Trigger.Icon sf="camera.fill" />
        <NativeTabs.Trigger.Label>Capture</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="logbook">
        <NativeTabs.Trigger.Icon sf="book.fill" />
        <NativeTabs.Trigger.Label>Logbook</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
```

**Impact on map screen:**
- REMOVE the floating bottom bar (Capture/Logbook buttons) from `app/(main)/index.tsx`
- KEEP the floating top bar (profile, community, notifications)
- The map screen's `bottom` safe area inset usage changes — the native tab bar handles bottom inset automatically
- The `BirdInfoCard` positioning may need adjustment to sit above the tab bar

**Profile/Community as push screens:**
- These are currently Stack.Screen entries that push from map
- With NativeTabs, they need to be nested inside the map tab's stack, OR use `router.push()` which creates a stack within the tab
- Recommended: Keep profile and community as screens that push WITHIN the map tab stack, not as separate tabs

**IMPORTANT — unstable API warning:** `expo-router/unstable-native-tabs` is marked unstable. The API may change in minor SDK versions. This is acceptable for a prototype/demo but should be noted.

**Alternative if NativeTabs proves problematic:** Use `@react-navigation/native-bottom-tab-navigator` via Expo Router's JS tabs (`expo-router` Tabs component). Less native feel but stable API.

**Confidence:** MEDIUM — NativeTabs is available in SDK 55 and documented, but marked unstable. Some GitHub issues report edge cases with iOS 18. Test thoroughly on device.

---

### 6. Design System Enforcement — Systematic Token Replacement

**Type:** MODIFIED (every screen file + src/components/ui/Button.tsx)

**Current gap analysis:**

| Token Category | Defined In | Used By Screens | Gap |
|----------------|-----------|-----------------|-----|
| Colors (semantic) | `src/theme/colors.ts` | All screens use `semantic.*` | Mostly adopted |
| Typography | `src/theme/typography.ts` | NO screens use tokens | Full gap — all use hardcoded fontSize/fontWeight |
| Spacing | `src/theme/spacing.ts` | ~2 screens use `spacing.*` | Major gap — most use hardcoded numbers |
| Components (borderRadius, buttons) | `src/theme/components.ts` | NO screens use tokens | Full gap |
| Font (Rubik) | `src/theme/typography.ts` | Never loaded | Font not loaded at all |

**Step 1: Load Rubik font**

The `expo-font` plugin is already in app.json. With SDK 55, the recommended approach is the config plugin + `useFonts` hook:

```typescript
// app/_layout.tsx — add font loading to existing hydration guard
import { useFonts } from 'expo-font'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Rubik-Light': require('@/assets/fonts/Rubik-Light.ttf'),
    'Rubik-Regular': require('@/assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('@/assets/fonts/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('@/assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-Bold': require('@/assets/fonts/Rubik-Bold.ttf'),
  })

  // Combine with existing hydration check
  if (!isHydrated || !fontsLoaded) {
    return null  // Splash screen stays visible
  }
  // ... existing SplashScreen.hideAsync()
}
```

**Rubik font files:** Download from Google Fonts, place in `src/assets/fonts/`. Need weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) — matching what typography.ts defines.

**Step 2: Update typography tokens**

```typescript
// src/theme/typography.ts — map fontWeight to specific font files
export const typography = {
  h2: {
    fontFamily: 'Rubik-Regular',  // was just 'Rubik'
    fontSize: 30,
    // Remove fontWeight — the font file IS the weight
    lineHeight: 36,
  },
  // ... same pattern for all tokens
}
```

**Step 3: Replace hardcoded values in screens**

Every screen currently does:
```typescript
heading: { fontSize: 30, fontWeight: '700', color: semantic.textPrimary }
```

Replace with:
```typescript
import { typography } from '@/theme/typography'
import { spacing } from '@/theme/spacing'

heading: { ...typography.h2, fontWeight: '700', color: semantic.textPrimary }
// Or better — add a 'h2Bold' variant to typography tokens
```

**Files to modify (all screens with hardcoded text styles):**
- `app/(onboarding)/welcome.tsx`
- `app/(onboarding)/ai-bird-id.tsx`
- `app/(onboarding)/birding-journey.tsx`
- `app/(onboarding)/name.tsx`
- `app/(onboarding)/discover.tsx`
- `app/(onboarding)/goals.tsx`
- `app/(onboarding)/green-time.tsx`
- `app/(onboarding)/community.tsx`
- `app/(onboarding)/paywall.tsx`
- `app/(onboarding)/reminders.tsx`
- `app/(onboarding)/mailing-list.tsx`
- `app/(main)/index.tsx`
- `app/(main)/profile.tsx`
- `app/(main)/community.tsx`
- `src/components/ui/Button.tsx`
- `src/components/map/BirdInfoCard.tsx`
- `src/components/onboarding/ProgressDots.tsx`

**This is the highest-touch change in v1.1** — it modifies every screen file. Do it early so all subsequent feature work uses tokens from the start.

**Button component token alignment:**
```typescript
// Button currently uses borderRadius: 16, but components.ts defines buttons.default.borderRadius: 9999 (full pill)
// Decision needed: align Button to use theme tokens or update tokens to match current Button
// Recommendation: Update Button to use theme component tokens
```

---

### 7. Fixed Bottom CTA Standardization — OnboardingLayout Footer Update

**Type:** MODIFIED (`src/components/onboarding/OnboardingLayout.tsx`)

**This is NOT a new component.** The footer pattern already exists in OnboardingLayout. The requirement is to standardize its padding values.

**Current footer styles:**
```typescript
footer: {
  paddingHorizontal: 24,  // ← stays (or use spacing['6'])
  gap: 8,                 // ← stays
}
// paddingBottom is dynamic: { paddingBottom: bottom + 20 }
```

**Required standardization:**
```typescript
footer: {
  paddingHorizontal: spacing['4'],  // 16px (requirement says 16px horizontal)
  paddingBottom: bottom + spacing['6'],  // 24px above home indicator (requirement says 24px)
  gap: spacing['2'],  // 8px between buttons
}
```

**Wait — conflict:** The requirement says "16px horizontal" but the current value is 24px and the body content also uses 24px padding. Using 16px for the footer while body uses 24px would create a visual misalignment.

**Recommendation:** Verify the exact spec. If 16px is confirmed, the footer CTAs will be wider than the body content (edge-to-edge minus 16px on each side instead of 24px). This could be intentional for more prominent CTAs. If it's a mistake, keep 24px to match body content.

**Implementation — single change point:**
- Modify `OnboardingLayout.tsx` footer styles
- ALL onboarding screens automatically inherit the change (they pass content into the `footer` slot)
- No per-screen changes needed

**This is the simplest change in v1.1.** It touches one file and propagates everywhere.

---

## New Components vs Modified Components

### New Components to Create

| Component | Location | Purpose | Dependencies |
|-----------|----------|---------|-------------|
| `MosaicAnimation` | `src/components/onboarding/MosaicAnimation.tsx` | Auto-scrolling bird image grid | Reanimated, expo-image |
| `BottomSheet` | `src/components/ui/BottomSheet.tsx` | Shared draggable bottom sheet | Reanimated, Gesture Handler |
| `AuthDrawerContent` | `src/components/onboarding/AuthDrawerContent.tsx` | Apple/Google/Email sign-in buttons | Button component, theme tokens |
| `capture.tsx` | `app/(main)/capture.tsx` | Placeholder tab screen | None (placeholder) |
| `logbook.tsx` | `app/(main)/logbook.tsx` | Placeholder tab screen | None (placeholder) |

### Modified Components

| Component | Location | What Changes | Risk |
|-----------|----------|-------------|------|
| `app.json` | root | Splash screen config plugin, font config | Low (config only, needs rebuild) |
| `app/_layout.tsx` | root | Add font loading with useFonts | Low (additive) |
| `app/(main)/_layout.tsx` | route layout | Stack → NativeTabs | HIGH (navigation structure change) |
| `app/(main)/index.tsx` | map screen | Remove floating bottom bar, adjust positioning | Medium |
| `app/(onboarding)/welcome.tsx` | welcome screen | Add MosaicAnimation, wire BottomSheet for auth | Medium |
| `app/(onboarding)/paywall.tsx` | paywall | Full visual redesign, dismiss-to-home navigation | Medium |
| `OnboardingLayout.tsx` | shared component | Footer padding standardization | Low |
| `Button.tsx` | shared component | Apply theme component tokens | Low |
| ALL screen files | throughout | Typography/spacing token replacement | Low per file, high total touch count |

### Components NOT Modified

| Component | Why Not |
|-----------|---------|
| `src/stores/onboarding.ts` | Store shape unchanged — completeOnboarding already exists |
| `src/data/birds.ts` | Bird data unchanged |
| `src/components/map/BirdMarker.tsx` | Map markers unaffected by v1.1 features |
| `src/components/map/BirdInfoCard.tsx` | Only typography token updates (part of enforcement sweep) |
| `app/index.tsx` (redirect guard) | Redirect logic unchanged |

---

## Data Flow Changes

**No new stores.** No new persistence. No new data sources.

The only data flow additions:
1. **BottomSheet open/close** — local `useSharedValue<boolean>` in welcome.tsx and map screen. Not in store.
2. **Paywall dismiss** — calls existing `completeOnboarding()` action, then `router.replace()`. Same store, new navigation path.
3. **Font loaded state** — `useFonts` hook in root layout, combined with existing hydration guard. Splash screen stays visible until both are ready.

---

## Suggested Build Order (Dependency-Aware)

```
Phase 1: Foundation (no feature dependencies)
├── 1a. Splash screen config (app.json update + rebuild)
├── 1b. Load Rubik fonts (app/_layout.tsx + font files)
├── 1c. Update typography tokens (fontFamily per weight)
└── 1d. Design system enforcement sweep (all screens)
     ↓ (all screens now use tokens — prerequisite for everything below)

Phase 2: Shared Components (no screen dependencies)
├── 2a. BottomSheet component (src/components/ui/BottomSheet.tsx)
├── 2b. MosaicAnimation component (src/components/onboarding/MosaicAnimation.tsx)
└── 2c. Fixed bottom CTA standardization (OnboardingLayout footer)
     ↓ (shared components ready for integration)

Phase 3: Onboarding Flow Changes
├── 3a. Welcome screen: integrate MosaicAnimation + BottomSheet for auth
├── 3b. Paywall redesign: new layout + dismiss-to-home navigation
└── 3c. Onboarding layout fixes (dots styling, spacing, overflow)
     ↓ (onboarding complete)

Phase 4: Home Screen Navigation
├── 4a. Convert (main)/_layout.tsx to NativeTabs
├── 4b. Create capture.tsx and logbook.tsx placeholder tabs
├── 4c. Remove floating bottom bar from map screen
├── 4d. Wire profile/community as push screens within map tab
└── 4e. Map drawer (full-width swipeable bottom sheet on map)
     ↓ (all features complete)

Phase 5: Polish
├── 5a. Debug button repositioning (move to top of screen)
└── 5b. Cross-feature integration testing
```

**Why this order:**
1. **Phase 1 first** — Font loading and token enforcement affect every subsequent screen. Doing this first means all new components and screen modifications use the design system from day one. The splash screen config requires a rebuild, so batch it with font loading.
2. **Phase 2 before 3** — BottomSheet and MosaicAnimation are generic components. Build and test them in isolation before integrating into screens.
3. **Phase 3 before 4** — Onboarding is the first-run experience. If the demo starts with onboarding, polish it first. The paywall's dismiss-to-home navigation depends on the redirect guard already working (it does).
4. **Phase 4 last for features** — The NativeTabs conversion is the highest-risk change (modifies navigation structure). Do it after all onboarding work is stable so there is a working fallback. The map drawer (bottom sheet on map) depends on the shared BottomSheet component from Phase 2.
5. **Phase 5 is pure polish** — No new features, just refinement.

**Parallelization opportunities:**
- Phase 1a + 1b can run in parallel (different files)
- Phase 2a + 2b can run in parallel (independent components)
- Phase 3a + 3b can run in parallel (different screens)
- Phase 4a-4d are sequential (each depends on the previous)

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using @gorhom/bottom-sheet
**What:** Installing `@gorhom/bottom-sheet` for the bottom sheet features.
**Why bad:** Incompatible with Reanimated v4 (4.2.1). The library will fail to open/animate. Multiple GitHub issues confirm this with no fix as of March 2026.
**Instead:** Build a custom BottomSheet using Reanimated v4 + Gesture Handler v2 APIs directly. The Reanimated docs provide a compatible example.

### Anti-Pattern 2: Mixing NativeTabs and Stack in (main)
**What:** Using NativeTabs as the top-level layout but keeping Stack.Screen definitions for profile/community alongside tab definitions.
**Why bad:** Expo docs explicitly warn against mixing Tabs and NativeTabs, and profile/community are push destinations, not tab destinations.
**Instead:** Profile and community should be push screens within the map tab's navigation stack. Use `router.push('/profile')` from the map screen — Expo Router handles the stack-within-tab automatically.

### Anti-Pattern 3: Using a Portal/Provider for Bottom Sheets
**What:** Creating a BottomSheetProvider at the root layout to manage sheet state globally.
**Why bad:** Over-engineering for two use cases. Adds provider nesting, context overhead, and global state for what is local UI state.
**Instead:** Render the BottomSheet component directly in each screen that needs it. Control it with local `useSharedValue`.

### Anti-Pattern 4: Animated.ScrollView for Mosaic
**What:** Using a ScrollView with animated scroll position for the mosaic auto-scroll effect.
**Why bad:** ScrollView contentOffset animation crosses the JS bridge. At continuous auto-scroll speeds, this can cause micro-jank.
**Instead:** Use raw `translateY` animation on column containers with `withRepeat(withTiming(...))`. This runs entirely on the UI thread.

### Anti-Pattern 5: Loading Fonts in Individual Screens
**What:** Calling `useFonts` in each screen component.
**Why bad:** Font loading is async and would cause layout shifts. Multiple useFonts calls waste memory.
**Instead:** Load all font weights once in root layout. Gate rendering on `fontsLoaded` alongside hydration.

---

## Scalability Considerations

| Concern | Current State | After v1.1 | Notes |
|---------|--------------|------------|-------|
| Navigation complexity | 2 route groups, Stack only | 2 route groups + NativeTabs in (main) | Moderate increase — well within Expo Router's design |
| Shared components | 3 (Button, OnboardingLayout, ProgressDots) | 5 (+BottomSheet, MosaicAnimation) | Healthy growth |
| Theme adoption | Partial (colors only) | Full (colors + typography + spacing + components) | Major improvement for consistency |
| Animation surface | Button press, screen transitions | + mosaic loop, bottom sheet gestures | All Reanimated UI-thread — no perf concern |
| Font loading | No custom fonts | 5 Rubik weights | ~150KB total — loaded once, cached |

---

## Sources

- Existing codebase analysis (all source files read directly — HIGH confidence)
- [Expo SplashScreen documentation](https://docs.expo.dev/versions/latest/sdk/splash-screen/) — config plugin API (HIGH confidence)
- [Expo Splash Screen guide](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/) — imageWidth, backgroundColor (HIGH confidence)
- [Expo Router Native Tabs](https://docs.expo.dev/router/advanced/native-tabs/) — NativeTabs API, limitations (MEDIUM confidence — unstable API)
- [Expo Router Native Tabs SDK reference](https://docs.expo.dev/versions/latest/sdk/router-native-tabs/) — component API (MEDIUM confidence)
- [gorhom/react-native-bottom-sheet#2546](https://github.com/gorhom/react-native-bottom-sheet/issues/2546) — Reanimated v4 incompatibility confirmed (HIGH confidence)
- [gorhom/react-native-bottom-sheet#2528](https://github.com/gorhom/react-native-bottom-sheet/issues/2528) — additional Reanimated v4 failure report (HIGH confidence)
- [Reanimated Bottom Sheet example](https://docs.swmansion.com/react-native-reanimated/examples/bottomsheet/) — v4-compatible implementation reference (HIGH confidence)
- [Expo Router v55 blog post](https://expo.dev/blog/expo-router-v55-more-native-navigation-more-powerful-web) — SDK 55 native navigation features (MEDIUM confidence)

---

*Architecture research for v1.1 Polish & Refinement: 2026-03-09*

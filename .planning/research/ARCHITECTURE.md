# Architecture Patterns

**Domain:** Bird watching mobile app prototype (Expo/React Native)
**Researched:** 2026-03-09
**Confidence:** HIGH (based on existing codebase analysis + training data for Expo SDK 55, react-native-screens, react-native-map-clustering)

## Recommended Architecture

The app follows a **full-bleed map shell with form sheet overlays** pattern. There is no tab navigator. The map is the primary surface; all secondary screens present as native iOS form sheets via `react-native-screens`. State is client-only via Zustand with AsyncStorage persistence.

```
Root Layout (GestureHandlerRootView + DevPanel)
├── (onboarding)/ Stack [gestureEnabled: false]
│   ├── welcome → name → location → skill-level → interests → notifications → summary → paywall
│   └── [linear wizard, no back gesture]
│
├── (main)/ Stack [headerShown: false]
│   ├── index.tsx — Full-bleed MapView + floating UI overlay
│   ├── profile.tsx — formSheet presentation [0.75, 1.0 detents]
│   └── community.tsx — formSheet presentation [0.75, 1.0 detents]
│
└── index.tsx — Router guard (checks onboarding.completed → redirects)
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Root Layout** (`app/_layout.tsx`) | GestureHandlerRootView wrapper, StatusBar, DevPanel mount | All route groups |
| **Router Guard** (`app/index.tsx`) | Reads `onboarding.completed`, redirects | OnboardingStore |
| **Onboarding Stack** (`app/(onboarding)/`) | Linear wizard flow, 8 screens | OnboardingStore (write), Paywall |
| **Paywall** (`app/(onboarding)/paywall.tsx`) | Plan selection UI, variant switching | OnboardingStore (read name, complete), Router (replace to main) |
| **Map Screen** (`app/(main)/index.tsx`) | Full-bleed map, floating UI, bird markers, info card | Bird data, Router (push to sheets), Local state (region, selectedBird) |
| **Profile Sheet** (`app/(main)/profile.tsx`) | User stats, achievements (mock) | OnboardingStore (read name, skillLevel) |
| **Community Sheet** (`app/(main)/community.tsx`) | LegendList sighting feed (mock) | Static sighting data |
| **Button** (`src/components/ui/Button.tsx`) | Animated press with haptics (Gesture.Tap) | Consumer via onPress callback |
| **DevPanel** (`src/components/dev/DevPanel.tsx`) | Debug actions (reset, navigate, inspect) | OnboardingStore, AsyncStorage, Router |
| **Bird Data** (`src/data/birds.ts`) | Static typed array of 20 bird entries | Map screen |
| **OnboardingStore** (`src/stores/onboarding.ts`) | Persisted user profile state | All screens that read/write user data |
| **Theme** (`src/theme/`) | Color tokens, typography, spacing, component presets | All UI components |

### Data Flow

```
                    ┌─────────────────────────┐
                    │     AsyncStorage         │
                    │  (onboarding-storage)    │
                    └──────────┬──────────────┘
                               │ persist middleware
                    ┌──────────▼──────────────┐
                    │    Zustand Store         │
                    │  useOnboardingStore      │
                    │  - name, location        │
                    │  - skillLevel, interests │
                    │  - completed (boolean)   │
                    └──────────┬──────────────┘
                               │ selectors
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
    │ Router     │    │ Onboarding   │    │ Profile      │
    │ Guard      │    │ Screens      │    │ Sheet        │
    │ (redirect) │    │ (write)      │    │ (read)       │
    └────────────┘    └──────────────┘    └──────────────┘

    ┌──────────────────────────────────────────────────┐
    │                  Map Screen                       │
    │  ┌──────────┐   ┌────────────┐   ┌────────────┐ │
    │  │ MapView  │──▶│ onRegion   │──▶│ getVisible │ │
    │  │          │   │ Change     │   │ Birds()    │ │
    │  └──────────┘   └────────────┘   └─────┬──────┘ │
    │                                        │        │
    │  ┌──────────────┐   ┌──────────────────▼──────┐ │
    │  │ BirdInfoCard │◀──│ BirdMarker (memo)       │ │
    │  │ (selected)   │   │ onPress → setSelected   │ │
    │  └──────────────┘   └─────────────────────────┘ │
    │                                                  │
    │  ┌─────────────────────────────────────────────┐ │
    │  │ Floating UI (top bar + bottom bar)          │ │
    │  │ router.push('/profile') | router.push('/community') │
    │  └─────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────┘
```

## Patterns to Follow

### Pattern 1: Native Form Sheet Presentation

**What:** Use `react-native-screens` formSheet presentation via Expo Router Stack.Screen options for all modal-style overlays. This gives native iOS sheet behavior (drag handle, swipe-to-dismiss, detent snapping) with zero JS animation code.

**When:** Any screen that overlays the map (profile, community, future screens).

**Current implementation (already working):**
```typescript
// app/(main)/_layout.tsx
<Stack.Screen
  name="profile"
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: [0.75, 1.0],
  }}
/>
```

**Enhancement for polish:**
```typescript
<Stack.Screen
  name="profile"
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: [0.75, 1.0],
    sheetGrabberVisible: true,        // Native drag indicator
    sheetCornerRadius: 20,            // Consistent with app's borderRadius
    sheetExpandsWhenScrolledToEdge: true, // Natural scroll-to-expand
    headerShown: false,
  }}
/>
```

**Confidence:** HIGH -- `sheetAllowedDetents`, `sheetGrabberVisible`, `sheetCornerRadius`, and `sheetExpandsWhenScrolledToEdge` are supported in react-native-screens 4.x which is already installed (4.23.0). These are iOS-native sheet APIs exposed through UISheetPresentationController.

**Key constraint:** On Android, formSheet falls back to a standard modal presentation. The detent/grabber props are iOS-only. This is acceptable for an iOS-primary prototype.

### Pattern 2: Map Clustering with react-native-map-clustering

**What:** Replace the plain `<MapView>` with `<ClusteredMapView>` from `react-native-map-clustering` to automatically group nearby markers at low zoom levels.

**When:** Map screen has more than ~10 markers visible simultaneously.

**Implementation approach:**
```typescript
import MapView from 'react-native-map-clustering'
// NOT: import MapView from 'react-native-maps'
// react-native-map-clustering re-exports MapView as default

<MapView
  style={styles.map}
  initialRegion={LISBON_REGION}
  onRegionChangeComplete={setRegion}
  showsUserLocation
  showsCompass={false}
  clusterColor="#1B4332"
  clusterTextColor="#FFFFFF"
  radius={50}           // Cluster radius in pixels
  maxZoom={16}           // Stop clustering at high zoom
  minPoints={2}          // Minimum markers to form cluster
  animationEnabled={false} // Disable cluster animation for performance
>
  {visibleBirds.map((bird) => (
    <BirdMarker key={bird.id} bird={bird} onPress={setSelectedBird} />
  ))}
</MapView>
```

**Confidence:** MEDIUM -- react-native-map-clustering uses supercluster internally. The library wraps react-native-maps MapView and passes through all props. It is widely used but not maintained with high frequency. With only 20 static markers, clustering is more of a visual polish feature than a performance necessity. Verify compatibility with react-native-maps 1.26.x during integration.

**Architecture note:** The clustering library replaces the MapView import -- it is a drop-in wrapper, not an additional layer. The `<Marker>` children remain standard react-native-maps Markers. The `getVisibleBirds()` zoom filter should remain alongside clustering: clustering groups spatially close markers, while the zoom filter controls which rarity tiers appear at all.

### Pattern 3: Paywall Variant Architecture

**What:** Single paywall screen component that renders differently based on a `variant` search param. Variants share layout structure but differ in copy, pricing, and CTA.

**When:** Multiple paywall presentations needed (standard post-onboarding, Nature Day discount, future promotional variants).

**Current pattern (already implemented correctly):**
```typescript
// Paywall reads variant from search params
const params = useLocalSearchParams<{ variant?: string }>()
const isNatureDay = params.variant === 'nature-day'

// Conditional rendering based on variant
const monthlyPrice = isNatureDay ? '$3.99' : '$4.99'
```

**Enhancement for more variants:**
```typescript
// src/data/paywall-variants.ts
interface PaywallVariant {
  id: string
  headline: (name: string) => string
  monthlyPrice: string
  annualPrice: string
  ctaText: string
  banner?: { emoji: string; text: string }
  discount?: string
}

const VARIANTS: Record<string, PaywallVariant> = {
  default: {
    id: 'default',
    headline: (name) => name ? `${name}, unlock the full experience` : 'Unlock the full experience',
    monthlyPrice: '$4.99',
    annualPrice: '$39.99',
    ctaText: 'Start Free Trial',
  },
  'nature-day': {
    id: 'nature-day',
    headline: (name) => name ? `${name}, celebrate Nature Day` : 'Celebrate Nature Day',
    monthlyPrice: '$3.99',
    annualPrice: '$31.99',
    ctaText: 'Claim My Discount',
    banner: { emoji: '🌿', text: 'Nature Day — 20% off today only' },
    discount: '20%',
  },
}
```

**Rationale:** Extracting variant config to data makes it trivial to add seasonal promotions without touching paywall component logic. The component becomes a pure renderer of variant data.

### Pattern 4: Floating UI Layer on Map

**What:** Absolutely positioned UI elements overlaid on the full-bleed map, using `useSafeAreaInsets()` for correct device-specific positioning.

**When:** Any interactive element that floats over the map (profile button, community button, notification bell, capture/logbook buttons).

**Current pattern (correct, keep as-is):**
```typescript
const { top, bottom } = useSafeAreaInsets()

// Top bar floats above map
<Animated.View style={[styles.topBar, { top: top + 12 }]}>
  {/* icons */}
</Animated.View>

// Bottom bar floats below
<Animated.View style={[styles.bottomBar, { bottom: bottom + 20 }]}>
  {/* buttons */}
</Animated.View>
```

**Architecture note:** These should remain inline in the map screen component, not extracted to separate files. They are tightly coupled to the map's layout positioning and have no reuse case. Extracting them would add indirection without benefit.

### Pattern 5: Component Extraction Strategy

**What:** Extract components from screen files only when they have independent concerns or are reused.

**Recommended extractions from current codebase:**

| Component | Current Location | Extract To | Reason |
|-----------|-----------------|------------|--------|
| `BirdMarker` | `app/(main)/index.tsx` | `src/components/map/BirdMarker.tsx` | Memo'd component, will need custom marker styling |
| `BirdInfoCard` | `app/(main)/index.tsx` | `src/components/map/BirdInfoCard.tsx` | Complex UI with animation, own concern |
| `SightingItem` | `app/(main)/community.tsx` | Keep inline | Only used in community screen |
| `getVisibleBirds` | `app/(main)/index.tsx` | `src/utils/birds.ts` | Pure function, testable independently |

### Pattern 6: Uncontrolled Input for Performance

**What:** Use `useRef` for TextInput values instead of `useState`, committing to Zustand only on "Continue" press.

**When:** Onboarding text inputs (name, location) where keystroke re-renders are wasteful.

**Pattern (specified in PRD, not yet implemented):**
```typescript
const nameRef = useRef('')

<TextInput
  defaultValue={nameRef.current}
  onChangeText={(text) => { nameRef.current = text }}
/>

// On Continue:
useOnboardingStore.getState().setName(nameRef.current)
```

**Confidence:** HIGH -- standard React Native pattern. Using `getState()` (Zustand's non-reactive API) avoids subscription overhead.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Barrel Imports
**What:** Re-exporting from `index.ts` files (e.g., `import { Button } from '@/components'`)
**Why bad:** Metro evaluates ALL exports in the barrel, bloating bundle size and slowing TTI. With tree shaking still marked "unstable" in Metro, barrel files are especially harmful.
**Instead:** Import directly: `import { Button } from '@/components/ui/Button'`
**Note:** The existing `src/theme/index.ts` uses `require()` calls which is a barrel pattern. This is acceptable for the theme module since all tokens are typically needed together, but should not be replicated for components.

### Anti-Pattern 2: useState for Map Region Tracking with Side Effects
**What:** Using `useState` for region then deriving visible birds in render body.
**Why bad:** `getVisibleBirds(region)` runs on every render, not just region changes. Currently harmless with 20 birds, but would be a problem at scale.
**Instead:** This is fine for the prototype scope. React Compiler will auto-memoize the derivation. If perf issues appear, move to `useMemo` or `useDerivedValue` in Reanimated.

### Anti-Pattern 3: Inline Styles on Markers
**What:** Passing `style={{ ... }}` directly to `<Marker>` or its children.
**Why bad:** Creates new object references every render, defeating `React.memo` on BirdMarker.
**Instead:** Use `StyleSheet.create` for all marker styles. Extract to a static constant outside the component.

### Anti-Pattern 4: Using Pressable for Animated Buttons
**What:** Using `Pressable` with `onPressIn`/`onPressOut` for press animations.
**Why bad:** Press state changes round-trip through JS thread, causing frame drops during animations.
**Instead:** Use `GestureDetector` + `Gesture.Tap()` as the Button component already does. All press animation runs on UI thread via Reanimated worklets.

### Anti-Pattern 5: Direct AsyncStorage Access in Components
**What:** Reading/writing AsyncStorage directly from screen components.
**Why bad:** No centralized state, no persistence middleware, race conditions possible.
**Instead:** All persistent state flows through Zustand's `persist` middleware. Components use store hooks. Only DevPanel touches AsyncStorage directly (for the "clear all" action).

## Architecture Decisions and Their Implications

### Form Sheet vs. Bottom Sheet Libraries

The project uses native `presentation: 'formSheet'` via react-native-screens rather than JS-based bottom sheet libraries (react-native-bottom-sheet, gorhom/bottom-sheet).

**Pros of native formSheet:**
- Zero JS animation code -- iOS handles all sheet physics
- Free swipe-to-dismiss, keyboard avoidance, accessibility
- Detent support (0.75, 1.0) via UISheetPresentationController
- Consistent with iOS system conventions
- No additional dependency

**Cons:**
- iOS-only detent behavior (Android falls back to modal)
- Limited customization (cannot add snap points beyond what iOS offers)
- Content inside sheet cannot interact with content behind it

**Verdict:** Correct choice for this prototype. Native sheets are polished and require no maintenance. A JS bottom sheet would only be needed if the sheet required custom gesture interaction with the map beneath it, which is not in scope.

### No Tab Navigator

The app uses a Stack navigator with floating UI buttons instead of a bottom tab navigator. This is the correct pattern because:

1. The map is full-bleed -- a tab bar wastes vertical space on the primary interaction surface
2. Profile and Community are infrequent destinations, not constant navigation targets
3. Native form sheets provide better UX for occasional overlays than tab switching
4. The floating UI buttons match the design language of map-first apps (Uber, Google Maps)

### Zustand Store Boundaries

Currently there is one store (`onboarding`). The architecture should NOT add more stores prematurely. For a prototype with all-local data:

- **OnboardingStore** -- user profile + completion state (persisted)
- No "bird store" needed -- birds are static data, not state
- No "UI store" needed -- selected bird, region are local screen state
- No "community store" needed -- sightings are static mock data

If a second store becomes needed (e.g., for saved/favorited birds), create `src/stores/birds.ts` following the same Zustand + persist pattern.

## Suggested Build Order

Dependencies flow top-to-bottom. Items at the same level can be parallelized.

```
Phase 1: Foundation Polish
├── Theme tokens integration (colors, typography applied to existing screens)
├── Custom fonts via expo-font config plugin
├── ESLint rules (jsx-no-leaked-render, no-barrel-files)
└── React Compiler setup (babel-plugin-react-compiler)

Phase 2: Onboarding Polish
├── Animated transitions (FadeIn content, spring button effects)
├── Uncontrolled TextInput pattern (name, location)
├── Disabled back gesture (already done in layout)
└── ProgressDots integration on all screens

Phase 3: Map + Clustering
├── Extract BirdMarker and BirdInfoCard to src/components/map/
├── Install and integrate react-native-map-clustering
├── Custom cluster styling (brand colors)
└── Verify clustering + zoom filter work together

Phase 4: Form Sheets
├── Enhance sheet options (grabber, corner radius, scroll expansion)
├── Profile sheet polish (avatar, stats, achievements layout)
├── Community sheet with LegendList feed
└── Verify sheet behavior with keyboard (if adding inputs later)

Phase 5: Paywall Polish
├── Extract paywall variant config to data file
├── Animated plan toggle (spring animation refinement)
├── Nature Day banner with entering animation
├── Personalized headline from Zustand store

Phase 6: Dev Tooling
├── FPS monitor (useFrameCallback)
├── DevPanel trigger → draggable floating button (PanGesture)
├── DevPanel as formSheet (upgrade from Modal)
└── State inspector formatting

Phase 7: Production Optimizations
├── Tree shaking (.env flags)
├── Bundle verification
├── Error boundary coverage audit
└── 60fps animation verification on device
```

**Phase ordering rationale:**
- **Phase 1 first** because theme tokens and React Compiler affect every subsequent component. Font loading via config plugin requires a rebuild.
- **Phase 2 before 3** because onboarding is the first-run experience -- polishing it first means demo-ready onboarding even if later phases are incomplete.
- **Phase 3 before 4** because the map is the primary screen. Clustering changes the MapView import which affects the entire map component.
- **Phase 4 after 3** because sheets are opened from the map. The map must be stable before wiring sheet navigation.
- **Phase 5 independent** of 3/4 -- paywall is in the onboarding flow, so it can be polished in parallel with map work.
- **Phase 6 supports** development throughout, but the FPS monitor specifically validates Phase 7 optimizations.
- **Phase 7 last** because optimization should only happen after features are complete and can be measured.

## Scalability Considerations

| Concern | Current (20 birds) | At 200 birds | At 2000+ birds |
|---------|---------------------|--------------|----------------|
| Marker rendering | Direct map, no perf issue | Clustering essential | Clustering + viewport culling |
| Data loading | Static import | Static import still fine | Lazy load by region, paginate |
| State management | Zustand local | Zustand local | Add React Query for server state |
| Map interactions | Direct onPress | Stable, use useCallback | Debounce region changes |
| List rendering | LegendList | LegendList handles well | LegendList with pagination |

For the prototype scope (20 birds, static data), none of these scaling concerns are active. The architecture is structured to accommodate growth without rewrites.

## Sources

- Existing codebase analysis (all source files read directly)
- PRD-CLAUDE/01-PRD.md (project specification)
- .planning/codebase/ARCHITECTURE.md (current architecture doc)
- react-native-screens documentation (training data, HIGH confidence for 4.x API surface)
- react-native-map-clustering (training data, MEDIUM confidence -- verify version compatibility)
- Expo Router documentation (training data, HIGH confidence for SDK 55 patterns)
- React Compiler documentation (training data, MEDIUM confidence -- verify babel plugin config for RN)

---

*Architecture research: 2026-03-09*

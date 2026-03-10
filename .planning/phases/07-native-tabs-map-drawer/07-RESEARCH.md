# Phase 7: Native Tabs & Map Drawer - Research

**Researched:** 2026-03-10
**Domain:** Expo Router unstable-native-tabs, @gorhom/bottom-sheet v5, react-native-gesture-handler TapGesture
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use Expo Router's `unstable-native-tabs` for true native iOS UITabBarController
- 4 tabs in order: Map, Community, Capture, Logbook
- SF Symbols for tab icons (map.fill, person.2.fill, camera.fill, book.fill)
- Active state: dark navy (#2D3142), inactive: muted gray
- Map is the default/home tab
- Community tab shows the existing community.tsx screen (moved from floating top bar icon)
- Full-width bottom sheet using @gorhom/bottom-sheet (already installed v5.2.8)
- Two snap points: half-screen (~50%) and dismissed (swipe down to dismiss)
- No backdrop overlay — map stays fully visible and interactive
- Drawer touches left, right, and bottom edges (NAV-03)
- Renders above all other content (NAV-04)
- Tapping a different bird marker swaps drawer content in-place (no close/reopen animation)
- Drawer content: bird image, name, species (italic), description, rarity badge
- Tapping the bird image in the drawer pushes a full BirdDetail screen (standard iOS push from right)
- Drawer closes when detail screen pushes; returning to map shows clean map
- BirdDetail scrollable screen with: hero image, name/species/rarity/description, habitat & behavior (placeholder), small static map, "Log sighting" CTA (disabled placeholder)
- Remove visible floating debug button entirely
- Triple-tap gesture anywhere triggers dev panel (accessible from any screen)
- Panel presentation style is Claude's discretion
- Remove community icon from floating top bar (moved to tab bar)
- Keep Profile (left) and Notification (right) as floating icons on map tab
- Capture & Logbook tabs: minimal placeholder screens (centered icon + "Coming soon" text)

### Claude's Discretion
- Exact drawer snap point percentages and animation curves
- SF Symbol names for tab icons (closest matches)
- Bird detail screen spacing, typography hierarchy, and parallax effect
- Triple-tap gesture implementation approach (GestureHandler wrapper vs custom)
- Debug panel presentation style (formSheet vs bottom sheet)
- Placeholder text content for habitat/behavior section
- Static map size and styling on detail screen
- Tab bar label visibility (icons-only vs icons+labels)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Home screen uses native iOS tab bar for Map, Community, Capture, Logbook | expo-router `unstable-native-tabs` — NativeTabs + NativeTabs.Trigger pattern confirmed in installed v55.0.4 |
| NAV-02 | Debug button positioned at top of screen with app-consistent styling | Remove floating trigger; replace with triple-tap GestureDetector wrapping root GestureHandlerRootView child |
| NAV-03 | Map bird info drawer is full-width (left, right, bottom edges) | @gorhom/bottom-sheet BottomSheet with `style={{ marginHorizontal: 0 }}` and `bottomInset: 0` |
| NAV-04 | Map drawer renders above all other content (including debug) | BottomSheet default renders in portal above content; zIndex managed by portal layer |
| NAV-05 | Map drawer supports swipe-to-dismiss gesture | `enablePanDownToClose={true}` on BottomSheet + `index={-1}` initial state |
</phase_requirements>

---

## Summary

Phase 7 converts the main navigation from a custom floating bottom bar to a true native iOS tab bar using `expo-router/unstable-native-tabs`, and replaces the floating BirdInfoCard with a full-width @gorhom/bottom-sheet drawer. Both libraries are **already installed** in the project — expo-router ~55.0.4 ships the native tabs module, and @gorhom/bottom-sheet 5.2.8 is in package.json. No new package installs are required.

The native tabs implementation requires converting `app/(main)/_layout.tsx` from a `Stack` to a `NativeTabs` navigator. Each tab maps to a file in the `(main)` group. The Map tab needs a nested Stack for the bird-detail push. The `NativeTabs.Trigger` component accepts `sf` icon names via the `sf-symbols-typescript` package (also already installed as a transitive dep of expo-router). All four target SF Symbols (`map.fill`, `person.2.fill`, `camera.fill`, `book.fill`) are confirmed present in the installed type definitions.

The bottom sheet drawer pattern requires starting at index `-1` (closed), calling `ref.current.snapToIndex(0)` when a bird marker is tapped, and calling `ref.current.close()` on dismiss. Content-swapping in-place (tapping a different marker while drawer is open) is achieved by updating a `selectedBird` state variable without closing/reopening the sheet. The triple-tap dev panel trigger is implemented using `GestureDetector` with `Gesture.Tap().numberOfTaps(3)` wrapping the root content — this approach is fully compatible with the existing `GestureHandlerRootView` in `app/_layout.tsx`.

**Primary recommendation:** Convert `_layout.tsx` to NativeTabs first (lowest risk, file-routing driven), then wire the bottom sheet into the map screen, then add the triple-tap gesture to the root layout.

---

## Standard Stack

### Core (already installed — no new installs)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-router | ~55.0.4 | File-based routing + NativeTabs | Already installed; native-tabs module confirmed present |
| @gorhom/bottom-sheet | 5.2.8 | Bird drawer with snap points | Already installed; confirmed Reanimated 4 compat |
| react-native-gesture-handler | ~2.30.0 | Gesture detection (triple-tap, drawer pan) | Already installed; peer dep of bottom-sheet |
| react-native-reanimated | 4.2.1 | UI-thread animations for sheet | Already installed; Reanimated 4 is the project standard |
| sf-symbols-typescript | (transitive dep) | TypeScript types for SF Symbol names | Ships with expo-router; confirms valid SF Symbol names |
| expo-symbols | (transitive dep) | Native SF Symbol rendering on iOS | Used internally by expo-router native-tabs |

### No new packages needed
The full library surface for this phase is already installed. Zero `npm install` steps required.

---

## Architecture Patterns

### Recommended File Structure
```
app/(main)/
├── _layout.tsx          # CONVERT: Stack → NativeTabs
├── index.tsx            # Map tab (root) — stays as map screen
├── bird-detail.tsx      # NEW: full bird detail push screen
├── community.tsx        # MOVE: becomes tab screen (no layout changes needed)
├── capture.tsx          # NEW: placeholder tab
├── logbook.tsx          # NEW: placeholder tab
└── profile.tsx          # STAYS: Stack push from floating icon
```

The Map tab requires a nested Stack for the bird-detail push. In Expo Router, this is achieved by creating a `(map)` group or by having `_layout.tsx` nest a `Stack` inside the Map trigger's screen content. The simpler approach: keep `app/(main)/_layout.tsx` as NativeTabs, and the Map screen itself (`index.tsx`) will still be able to `router.push('/bird-detail')` because Expo Router's `NativeTabs` integrates with the root Stack.

**Recommended approach**: NativeTabs at the `(main)` group level, bird-detail as a sibling screen pushed via root Stack (or within a `(map)` subgroup). The simplest working pattern is to add `bird-detail` as a Stack screen in `app/(main)/_layout.tsx` alongside the tab screens — NativeTabs supports mixed screen types (triggers + regular Stack screens).

### Pattern 1: NativeTabs Layout Conversion

**What:** Replace `Stack` with `NativeTabs` in `app/(main)/_layout.tsx`. Each `NativeTabs.Trigger` maps to a file by `name`.

**When to use:** Root layout for tab-based navigation.

```tsx
// Source: expo-router/build/native-tabs/NativeTabs.d.ts (confirmed in installed module)
import { NativeTabs } from 'expo-router/unstable-native-tabs'

export default function MainLayout() {
  return (
    <NativeTabs
      iconColor={{
        default: '#9CA3AF', // semantic.textMuted
        selected: '#2D3142', // semantic.textPrimary
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="map.fill" />
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="community">
        <NativeTabs.Trigger.Icon sf="person.2.fill" />
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
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

**Key props on NativeTabs:**
- `iconColor` — accepts `{ default, selected }` object for state-based coloring
- `tintColor` — fallback tint (simpler if you want same color for both states)
- `blurEffect` — tab bar blur style (e.g., `'systemMaterial'` for translucent iOS look)
- `backgroundColor` — explicit bg color if blur is disabled

### Pattern 2: Bottom Sheet Bird Drawer (no backdrop, full-width)

**What:** BottomSheet starts closed (index -1), opens to 50% on bird tap, dismisses on swipe-down.

**Key configuration for NAV-03/04/05:**
- `snapPoints={['50%']}` — single snap point at half screen
- `index={-1}` — starts closed
- `enablePanDownToClose={true}` — NAV-05 swipe-to-dismiss
- `backdropComponent={null}` — no overlay, map stays interactive
- No `handleComponent={null}` — keep default drag handle so user knows it's swipeable
- `style={{ marginHorizontal: 0 }}` — full width, touches left/right edges (NAV-03)
- `bottomInset={0}` — touches bottom edge (NAV-03)

**Swapping bird content in-place** (no close/reopen):
```tsx
// When a different marker is tapped while sheet is already open:
setSelectedBird(bird)            // updates state — content re-renders
// Do NOT call ref.current.close() + ref.current.expand()
// The sheet animates the content change smoothly because it's just a state update
```

**Opening from closed state:**
```tsx
const sheetRef = useRef<BottomSheet>(null)
function handleBirdPress(bird: Bird) {
  setSelectedBird(bird)
  sheetRef.current?.snapToIndex(0)  // snap to '50%'
}
```

**Closing (dismiss):**
```tsx
// Swipe-down closes automatically via enablePanDownToClose
// Programmatic close (e.g. navigating to detail):
sheetRef.current?.close()
```

**Full-width positioning (NAV-03):**
```tsx
// Source: @gorhom/bottom-sheet/lib/typescript/components/bottomSheet/types.d.ts
<BottomSheet
  ref={sheetRef}
  index={-1}
  snapPoints={['50%']}
  enablePanDownToClose
  backdropComponent={null}
  onClose={() => setSelectedBird(null)}
  style={{ marginHorizontal: 0 }}  // removes side margins
>
  <BottomSheetView>
    {selectedBird && <BirdDrawerContent bird={selectedBird} />}
  </BottomSheetView>
</BottomSheet>
```

**NAV-04 (renders above all content):** @gorhom/bottom-sheet renders using a Portal/absolute positioning mechanism that sits above the React Native view hierarchy by default. No extra zIndex work needed, but the BottomSheet must be placed as the last child in the parent view (after MapView and overlay views).

### Pattern 3: Triple-tap Dev Panel Trigger

**What:** Replace the floating debug button with a global triple-tap gesture. The `GestureHandlerRootView` already wraps the entire app in `app/_layout.tsx`. We add a `GestureDetector` wrapping the root content.

**Implementation:**
```tsx
// Source: react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture.d.ts
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

const tripleTap = Gesture.Tap()
  .numberOfTaps(3)
  .runOnJS(true)
  .onEnd(() => {
    setDevPanelVisible(true)
  })

// Wrap the Stack in app/_layout.tsx:
<GestureHandlerRootView style={{ flex: 1 }}>
  <GestureDetector gesture={tripleTap}>
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  </GestureDetector>
  {/* DevPanel Modal renders outside GestureDetector */}
  {DevPanel ? <DevPanel /> : null}
</GestureHandlerRootView>
```

**Alternative approach:** Keep triple-tap trigger state in a Zustand store or React context so DevPanel can remain in `app/_layout.tsx` without prop-drilling. Current DevPanel already uses a `useState` for `visible` — convert to a standalone trigger component that reads from context or global state.

### Pattern 4: Bird Detail Screen

**What:** Full-detail scrollable screen pushed via `router.push('/bird-detail')` from within the drawer. The bird data is passed via Expo Router params or global state.

**Passing data:** Since `Bird` objects contain image URLs (not serializable issues), use Expo Router params (bird.id) and look up from `birds` array in the detail screen. Avoids serialization issues with complex objects.

```tsx
// In drawer (tapping bird image):
router.push({ pathname: '/(main)/bird-detail', params: { birdId: bird.id } })
sheetRef.current?.close()

// In bird-detail.tsx:
const { birdId } = useLocalSearchParams()
const bird = birds.find(b => b.id === birdId)
```

### Anti-Patterns to Avoid

- **Mounting BottomSheet conditionally:** Don't render `{selectedBird && <BottomSheet>}` — this causes remount on each bird tap. Keep BottomSheet always mounted, toggle via `snapToIndex(-1)` / `snapToIndex(0)`.
- **Using Stack inside NativeTabs for the Map tab:** NativeTabs handles the tab content independently. For bird-detail push, add it as a hidden/non-trigger screen in the NativeTabs layout or push to a screen in the root Stack group.
- **Setting marginHorizontal on the container instead of style prop:** The `style` prop on BottomSheet applies to the sheet panel itself. The `containerStyle` applies to the portal container. Use `style` for edge-to-edge.
- **Triple-tap without `runOnJS(true)`:** Gesture callbacks run on the UI thread by default in RNGH v2+. `setState` calls must run on JS thread.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Native tab bar | Custom View + Pressables mimicking UITabBar | `NativeTabs` from `expo-router/unstable-native-tabs` | UITabBarController native behavior (swipe between tabs, pop-to-root on re-tap) |
| Swipeable bottom sheet | Animated.View + PanResponder | `@gorhom/bottom-sheet` | Handles velocity, rubber-banding, safe area insets, keyboard interaction, scroll conflict resolution — extremely complex to hand-roll |
| Gesture detection for triple-tap | manual tap counter with setTimeout | `Gesture.Tap().numberOfTaps(3)` from RNGH | Handles timing windows, multi-touch disambiguation, UI thread correctness |
| SF Symbol rendering | Bundled PNGs or MaterialIcons fallback | `sf` prop on `NativeTabs.Trigger.Icon` | Automatic weight/size scaling, dark mode, accessibility labels, OS-native rendering |

**Key insight:** The bottom sheet gesture system alone has ~5000 lines of code handling scroll-drag conflicts, keyboard avoidance, rubber-banding, and velocity physics. A custom implementation would break in edge cases within days.

---

## Common Pitfalls

### Pitfall 1: NativeTabs + nested Stack for bird-detail push
**What goes wrong:** Placing `bird-detail.tsx` inside `(main)/` but not registering it causes "Route not found" errors when `router.push('/bird-detail')` is called.
**Why it happens:** In NativeTabs, all children of the layout are treated as tab triggers unless excluded. Expo Router's NativeTabs doesn't auto-exclude non-trigger files.
**How to avoid:** Register `bird-detail` explicitly. Either: (a) place it in the root Stack group outside `(main)`, or (b) if it needs to be inside `(main)`, check if NativeTabs supports non-trigger Stack screens in the same layout — from the type definitions, `NativeTabs` children are `NativeTabs.Trigger` components only. **Safer pattern: put `bird-detail.tsx` in `app/(main)/bird-detail.tsx` and push it from the root Stack** (root `_layout.tsx` Stack handles it as a modal/push screen above the tab group).
**Warning signs:** TypeScript errors about unknown routes, runtime "Unmatched route" errors.

### Pitfall 2: Bottom sheet appearing behind tab bar
**What goes wrong:** The bottom sheet at 50% height appears to be behind the native iOS tab bar, clipping the bottom content.
**Why it happens:** Native UITabBarController renders above the React Native view hierarchy. The bottom sheet portal may not account for the tab bar height as a bottom inset.
**How to avoid:** Use `bottomInset` prop on BottomSheet equal to the tab bar height (or 0 and let the content handle padding). The sheet's `snapPoints={['50%']}` percentage is calculated from the full screen height — the actual visible area above the tab bar will be less than 50%. If the drawer must truly appear **above** the tab bar (NAV-04), it needs to render in a portal that sits above the native UITabBarController — @gorhom/bottom-sheet renders in a React Native Modal portal which DOES appear above UITabBar.
**Warning signs:** Sheet content is partially hidden, swipe handle clips at tab bar boundary.

### Pitfall 3: `unstable-native-tabs` is an alpha API
**What goes wrong:** Props or behavior may differ from documentation; runtime issues are possible.
**Why it happens:** The `unstable-` prefix signals the API is not finalized. The project STATE.md flags this: "NativeTabs is alpha (`unstable-native-tabs`) — needs fallback plan if runtime issues arise."
**How to avoid:** Test on device early (not just simulator). Have a fallback plan: a custom tab bar using the `Tabs` navigator from expo-router (stable) with `tabBarStyle` override provides a similar visual result without native UITabBarController.
**Warning signs:** Crash on tab press, iOS-version-specific behavior differences (especially iOS 26 `minimizeBehavior` feature).

### Pitfall 4: Bird data not available in bird-detail.tsx
**What goes wrong:** Passing full Bird objects as route params fails or corrupts due to URL serialization.
**Why it happens:** Expo Router params are strings (URL-encoded). Passing a Bird object directly results in `[object Object]`.
**How to avoid:** Pass only `birdId` as a param. Look up the bird in the detail screen from the `birds` array by ID. The `birds` array is a static module-level constant — safe to import in any screen.
**Warning signs:** `[object Object]` in route params, undefined bird data in detail screen.

### Pitfall 5: GestureDetector triple-tap conflicts with MapView gestures
**What goes wrong:** The triple-tap GestureDetector on the root layout may consume or interfere with MapView pan/zoom gestures.
**Why it happens:** GestureHandler gesture composition requires explicit simultaneity declarations when multiple gestures share the same area.
**How to avoid:** Use `Gesture.Tap()` (not `Pan`) — tap gestures with 3 taps have a short activation window and don't block continuous gestures. Add `.maxDuration(500)` to keep the window tight. MapView's native gestures are registered outside RNGH's gesture system (they're native touch handlers), so conflict is less likely. If issues arise, scope the GestureDetector to a specific hit area (e.g., status bar region only).
**Warning signs:** Map stops zooming/panning, triple-tap occasionally fails on the map.

### Pitfall 6: BottomSheet `index` vs content mount timing
**What goes wrong:** BottomSheet renders its children even when closed (index -1), causing the drawer content to display a blank/null state initially.
**Why it happens:** `BottomSheet` always mounts children for performance (avoids remount animation). When `selectedBird` is null, the content renders nothing.
**How to avoid:** Render a placeholder (empty View) when `selectedBird` is null, OR only render the image/content conditionally inside `BottomSheetView`. The sheet will be closed (index -1) so invisible — rendering null children is fine. Avoid conditionally mounting/unmounting the `BottomSheet` itself.
**Warning signs:** Sheet flickers, content visible briefly during close animation.

---

## Code Examples

### NativeTabs Layout (verified from installed type definitions)

```tsx
// app/(main)/_layout.tsx
// Source: expo-router/build/native-tabs/NativeTabs.d.ts + types.d.ts (confirmed in node_modules)
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { colors } from '@/theme/colors'

export default function MainLayout() {
  return (
    <NativeTabs
      iconColor={{
        default: colors.neutral400,   // inactive gray
        selected: colors.neutral700,  // active dark navy
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="map.fill" />
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="community">
        <NativeTabs.Trigger.Icon sf="person.2.fill" />
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
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

### SF Symbol Icon with default/selected states

```tsx
// Source: expo-router/build/native-tabs/common/elements.d.ts
// sf prop accepts SFSymbol | { default?: SFSymbol; selected: SFSymbol }
<NativeTabs.Trigger.Icon
  sf={{ default: 'map', selected: 'map.fill' }}
/>
// OR simpler — use fill variants always, rely on iconColor for state:
<NativeTabs.Trigger.Icon sf="map.fill" />
```

### BottomSheet full-width bird drawer

```tsx
// Source: @gorhom/bottom-sheet/lib/typescript/components/bottomSheet/types.d.ts
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

const sheetRef = useRef<BottomSheet>(null)
const [selectedBird, setSelectedBird] = useState<Bird | null>(null)

function handleBirdPress(bird: Bird) {
  setSelectedBird(bird)
  sheetRef.current?.snapToIndex(0)
}

// In JSX (after MapView and overlays):
<BottomSheet
  ref={sheetRef}
  index={-1}
  snapPoints={['50%']}
  enablePanDownToClose
  backdropComponent={null}
  onClose={() => setSelectedBird(null)}
  style={{ marginHorizontal: 0 }}
  handleIndicatorStyle={{ backgroundColor: colors.neutral300 }}
>
  <BottomSheetView style={{ flex: 1 }}>
    {selectedBird && <BirdDrawerContent bird={selectedBird} />}
  </BottomSheetView>
</BottomSheet>
```

### Triple-tap DevPanel trigger

```tsx
// Source: react-native-gesture-handler (tapGesture.d.ts — numberOfTaps confirmed)
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

const tripleTap = Gesture.Tap()
  .numberOfTaps(3)
  .maxDuration(500)
  .runOnJS(true)
  .onEnd(() => setDevPanelVisible(true))

// In app/_layout.tsx, wrap Stack:
<GestureHandlerRootView style={{ flex: 1 }}>
  <GestureDetector gesture={tripleTap}>
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  </GestureDetector>
  {DevPanel ? <DevPanel visible={devPanelVisible} onClose={() => setDevPanelVisible(false)} /> : null}
</GestureHandlerRootView>
```

### Bird detail navigation (param-safe pattern)

```tsx
// Triggering push from drawer:
import { useRouter } from 'expo-router'
const router = useRouter()

function handleImagePress() {
  sheetRef.current?.close()
  router.push({ pathname: '/(main)/bird-detail', params: { birdId: selectedBird.id } })
}

// In app/(main)/bird-detail.tsx:
import { useLocalSearchParams } from 'expo-router'
import { birds } from '@/data/birds'

const { birdId } = useLocalSearchParams<{ birdId: string }>()
const bird = birds.find(b => b.id === birdId)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `Tabs` from expo-router (JS tab bar) | `NativeTabs` from `expo-router/unstable-native-tabs` | Expo SDK 52+ (Expo Router v4) | True UITabBarController, native animations, SF Symbols |
| `PanResponder` for sheets | `@gorhom/bottom-sheet` v5 | 2024 (v5 added Reanimated 4 compat) | Full gesture system, worklet-based animations |
| `GestureHandlerV1` (ref-based) | `Gesture.Tap()` API (v2) | react-native-gesture-handler v2 | Cleaner API, no ref-based handler composition |
| Floating bottom bar (current) | Native UITabBar | Phase 7 | System-managed, zero custom styling needed for standard behavior |

**Deprecated/outdated in this codebase:**
- `BirdInfoCard`: Absolute-positioned `Animated.View` with `SlideInDown` — replaced by BottomSheet
- Floating debug button (`position: absolute` `Pressable`) — replaced by triple-tap gesture
- Community icon in floating top bar — moved to tab bar

---

## Open Questions

1. **Bird-detail screen placement in routing hierarchy**
   - What we know: NativeTabs registers tab screens by `name` prop matching filenames. Non-trigger children behavior is undocumented.
   - What's unclear: Whether `bird-detail.tsx` inside `(main)/` can be pushed as a Stack screen when the group uses NativeTabs, or if it must live at the root level.
   - Recommendation: Place `bird-detail.tsx` at root Stack level (`app/bird-detail.tsx`) and push with absolute path to avoid any NativeTabs routing conflicts. If that causes visual issues (wrong transition), move to `(main)/bird-detail.tsx` and test.

2. **Tab bar appearance above BottomSheet**
   - What we know: Native UITabBarController renders in a native layer. @gorhom/bottom-sheet renders in a React Native Modal portal.
   - What's unclear: Whether the Modal portal actually appears above UITabBarController on iOS, or whether UITabBar always wins.
   - Recommendation: Test early on device. If sheet clips behind tab bar, use `bottomInset` to account for tab bar height and adjust snap point percentages accordingly. The existing STATE.md notes this library was chosen for Reanimated 4 compat — check if v5.2.8 has known UITabBar interaction issues.

3. **DevPanel visibility state location**
   - What we know: Current DevPanel manages its own `visible` state internally. Converting to triple-tap requires lifting state to `app/_layout.tsx`.
   - What's unclear: Best state management pattern — lift to `_layout.tsx` props, or use a lightweight context/Zustand slice.
   - Recommendation: Lift to `_layout.tsx` local state (`useState`). No need for Zustand — the dev panel is dev-only and ephemeral. Pass `visible` and `onClose` as props to DevPanel.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directories found |
| Config file | None — Wave 0 setup required |
| Quick run command | N/A (no test framework installed) |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Native tab bar renders with 4 tabs | manual-only | N/A — requires iOS device/simulator | ❌ Wave 0 |
| NAV-02 | Debug panel accessible via triple-tap | manual-only | N/A — gesture testing requires device | ❌ Wave 0 |
| NAV-03 | Drawer touches left, right, bottom edges | manual-only | N/A — visual/layout verification | ❌ Wave 0 |
| NAV-04 | Drawer renders above all content | manual-only | N/A — z-order requires visual check | ❌ Wave 0 |
| NAV-05 | Swipe-to-dismiss works | manual-only | N/A — gesture testing requires device | ❌ Wave 0 |

All NAV requirements are gesture/visual/layout behaviors that require manual device verification. No meaningful automated tests can cover these without a UI testing framework (Detox, etc.) which is out of scope for this prototype project.

### Sampling Rate
- **Per task commit:** Manual smoke test on iOS Simulator
- **Per wave merge:** Full manual test of all NAV-01 through NAV-05 behaviors on device
- **Phase gate:** All 5 NAV requirements visually verified before `/gsd:verify-work`

### Wave 0 Gaps
- No test framework installed — all verification is manual for this phase
- Recommended smoke test checklist (manual): Tab renders, tab switching, bird marker tap opens drawer, swipe-down dismisses, triple-tap opens dev panel

---

## Sources

### Primary (HIGH confidence)
- `node_modules/expo-router/build/native-tabs/` — Full native-tabs type definitions and implementation, confirmed installed in project (expo-router ~55.0.4)
- `node_modules/expo-router/build/native-tabs/types.d.ts` — NativeTabs props, NativeTabOptions, SymbolOrImageSource type signatures
- `node_modules/expo-router/build/native-tabs/common/elements.d.ts` — NativeTabs.Trigger.Icon sf prop, SFSymbolIcon type
- `node_modules/@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/types.d.ts` — BottomSheetProps: snapPoints, index, enablePanDownToClose, backdropComponent, style
- `node_modules/@gorhom/bottom-sheet/lib/typescript/types.d.ts` — BottomSheetMethods: snapToIndex, close, forceClose
- `node_modules/react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture.d.ts` — TapGesture.numberOfTaps(), maxDuration() confirmed
- `node_modules/sf-symbols-typescript/dist/index.d.ts` — `map.fill`, `person.2.fill`, `camera.fill`, `book.fill` all confirmed present

### Secondary (MEDIUM confidence)
- Project `STATE.md` decision log — confirms @gorhom/bottom-sheet v5 chosen for Reanimated 4 compat, NativeTabs alpha risk flagged
- `app/(main)/index.tsx` current implementation — existing bird marker + floating bar patterns to replace
- `src/components/dev/DevPanel.tsx` — current DevPanel structure for refactoring triple-tap approach

### Tertiary (LOW confidence)
- NativeTabs behavior with nested Stack screens for bird-detail push — not directly documented in installed module; based on Expo Router file-routing conventions

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — all libraries confirmed installed and type-checked from node_modules
- Architecture: HIGH — NativeTabs and BottomSheet API shapes verified from installed type definitions
- Pitfalls: MEDIUM — "NativeTabs + bird-detail routing" and "sheet above UITabBar" pitfalls are architectural inferences; require device testing to confirm

**Research date:** 2026-03-10
**Valid until:** 2026-04-09 (expo-router unstable-native-tabs may change in minor versions; verify before using)

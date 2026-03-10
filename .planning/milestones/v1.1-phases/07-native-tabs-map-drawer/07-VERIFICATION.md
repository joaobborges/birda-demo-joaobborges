---
phase: 07-native-tabs-map-drawer
verified: 2026-03-10T15:00:00Z
status: human_needed
score: 9/10 must-haves verified
re_verification: false
human_verification:
  - test: "Verify bottom sheet drawer renders ABOVE tab bar (portal behavior)"
    expected: "Opening a bird marker drawer should slide the sheet above the native tab bar, not clip behind it"
    why_human: "BottomSheetModal uses @gorhom/portal for rendering — cannot verify portal z-order statically; requires device/simulator"
  - test: "Verify double-tap gesture opens dev panel from all screens"
    expected: "Two quick taps anywhere (map, onboarding, paywall) opens the dev panel modal"
    why_human: "Gesture behavior requires runtime testing; numberOfTaps(2) change from plan's triple-tap is a documented deviation that needs UX confirmation"
  - test: "Verify drawer is truly full-width (NAV-03)"
    expected: "Drawer left and right edges should flush to screen edges with no side margins"
    why_human: "BottomSheetModal does not have the explicit style={{ marginHorizontal: 0 }} prop specified in the plan. Full-width edge-to-edge rendering must be confirmed visually"
  - test: "Verify tapping a different bird marker swaps drawer content without close/reopen animation"
    expected: "Sheet stays open; only content inside updates to new bird"
    why_human: "Requires runtime testing of two rapid marker taps; cannot verify animation behavior statically"
---

# Phase 7: Native Tabs, Map Drawer, Dev Panel Verification Report

**Phase Goal:** Replace floating bottom bar with native tab navigation, add bottom-sheet drawer for bird details, and convert debug button to hidden gesture trigger.
**Verified:** 2026-03-10T15:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Home screen shows a tab bar with Map, Community, Capture, and Logbook tabs | VERIFIED | `app/(main)/_layout.tsx` uses `<Tabs>` with 4 `Tabs.Screen` entries in correct order |
| 2 | Map is the default/active tab on launch | VERIFIED | `name="index"` is the first tab in `_layout.tsx`; Expo Router defaults to index route |
| 3 | Tapping Community tab shows the existing social feed screen | VERIFIED | `Tabs.Screen name="community"` maps to `app/(main)/community.tsx` (pre-existing file) |
| 4 | Capture and Logbook tabs show placeholder screens | VERIFIED | Both `capture.tsx` and `logbook.tsx` exist with centered icon + "Coming soon" subtitle |
| 5 | Floating bottom bar is removed from the map screen | VERIFIED | `app/(main)/index.tsx` contains no `bottomBar` style, no Capture/Logbook floating buttons |
| 6 | Community icon removed from floating top bar; Profile and Notification remain | VERIFIED | `topBar` has only Profile Pressable and Notification icon — no community `people` push |
| 7 | No visible floating debug button anywhere in the app | VERIFIED | `DevPanel.tsx` renders only a `Modal`, no Pressable trigger; no internal `useState` for visibility |
| 8 | Dev panel is accessible via a hidden tap gesture on root layout | VERIFIED (with caveat) | `app/_layout.tsx` has `GestureDetector` with `.numberOfTaps(2)` — DEVIATION: plan specified triple-tap (3); implementation uses double-tap (2) |
| 9 | Tapping a bird marker opens a bottom sheet drawer | VERIFIED | `BottomSheetModal` wired with `sheetRef.current?.present()` in `handleBirdPress`; `BirdDrawerContent` rendered inside |
| 10 | Tapping bird image in drawer pushes full bird detail screen | VERIFIED | `handleBirdImagePress` calls `sheetRef.current?.dismiss()` then `router.push('/bird-detail')` with `birdId` param |

**Score:** 9/10 truths verified (1 partial — gesture tap count deviation documented)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/(main)/_layout.tsx` | Tabs layout with 4 screens | VERIFIED | Uses `expo-router` `<Tabs>`, 4 `Tabs.Screen` entries, Ionicons icons, design system colors |
| `app/(main)/capture.tsx` | Capture placeholder with "Coming soon" | VERIFIED | Ionicons `camera-outline`, `typography.h2` title, "Coming soon" subtitle |
| `app/(main)/logbook.tsx` | Logbook placeholder with "Coming soon" | VERIFIED | Ionicons `book-outline`, `typography.h2` title, "Coming soon" subtitle |
| `app/_layout.tsx` | GestureDetector with tap trigger + DevPanel wiring | VERIFIED | `GestureDetector` wraps Stack, `DevPanel` receives `visible` + `onClose` props |
| `src/components/dev/DevPanel.tsx` | Controlled component accepting visible/onClose | VERIFIED | `DevPanelProps` interface defined, no internal visibility state, no floating trigger |
| `src/components/map/BirdDrawerContent.tsx` | Drawer content with bird info and image tap | VERIFIED | Named export, `Pressable`-wrapped image, name/species/description/rarity badge all present |
| `app/(main)/index.tsx` | Map screen with BottomSheetModal wired | VERIFIED | `BottomSheetModal` ref, `handleBirdPress`, `handleSheetClose`, `handleBirdImagePress` all wired |
| `app/bird-detail.tsx` | Full scrollable bird detail screen | VERIFIED | `useLocalSearchParams`, hero image, name/rarity row, species, description, habitat section, static MapView, disabled CTA |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/(main)/_layout.tsx` | `app/(main)/index.tsx` | `Tabs.Screen name="index"` | VERIFIED | Line 14: `<Tabs.Screen name="index"` |
| `app/(main)/_layout.tsx` | `app/(main)/community.tsx` | `Tabs.Screen name="community"` | VERIFIED | Line 23: `<Tabs.Screen name="community"` |
| `app/_layout.tsx` | `src/components/dev/DevPanel.tsx` | `visible` prop driven by gesture state | VERIFIED | Line 67-72: `<DevPanel visible={devPanelVisible} onClose={() => setDevPanelVisible(false)}` |
| `app/(main)/index.tsx` | `src/components/map/BirdDrawerContent.tsx` | `BirdDrawerContent` inside `BottomSheetModal` | VERIFIED | Line 15 import, line 179 usage inside `BottomSheetView` |
| `src/components/map/BirdDrawerContent.tsx` | `app/bird-detail.tsx` | `router.push` on image tap | VERIFIED | `handleBirdImagePress` in `index.tsx` calls `router.push({ pathname: '/bird-detail', params: { birdId: ... }})` |
| `app/(main)/index.tsx` | `@gorhom/bottom-sheet` | `sheetRef.current?.present/dismiss` | VERIFIED | `sheetRef = useRef<BottomSheetModal>(null)`, `.present()` on bird press, `.dismiss()` before push |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| NAV-01 | 07-01 | Home screen uses native iOS tab bar for Capture and Logbook | SATISFIED | `<Tabs>` with 4 screens in `(main)/_layout.tsx`; Capture and Logbook tabs exist |
| NAV-02 | 07-02 | Debug button is positioned at top of screen with app-consistent styling | SATISFIED (with note) | Requirement text describes repositioning; actual implementation removed the button entirely and added a hidden gesture. The goal intent (remove prominent debug UI) is satisfied. Implementation exceeds requirement intent. |
| NAV-03 | 07-03 | Map bird info drawer is full-width (left, right, bottom edges) | NEEDS HUMAN | `BottomSheetModal` lacks explicit `style={{ marginHorizontal: 0 }}` from plan. Default full-width behavior of `BottomSheetModal` is unverified statically. |
| NAV-04 | 07-03 | Map drawer renders above all other content (including debug) | NEEDS HUMAN | `BottomSheetModalProvider` at root level enables portal rendering above tab bar. Actual layering above floating icons requires runtime verification. |
| NAV-05 | 07-03 | Map drawer supports swipe-to-dismiss gesture | VERIFIED | `enablePanDownToClose` prop present on `BottomSheetModal` (line 173). `onDismiss={handleSheetClose}` clears `selectedBird`. |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/_layout.tsx` | 47 | `.numberOfTaps(2)` — plan specified 3, summary documents as deliberate post-checkpoint change | Info | None blocking. Double-tap activates dev panel. Documented deviation from plan. |
| `app/(main)/index.tsx` | 170-185 | `BottomSheetModal` lacks `backdropComponent={undefined}` prop | Warning | Default backdrop for `BottomSheetModal` is no-backdrop (passes through `...bottomSheetProps` to `BottomSheet` with no default). Map interactivity should be preserved, but needs visual confirmation. |
| `app/bird-detail.tsx` | 116 | `<Pressable style={styles.ctaButton}>` — "Log Sighting" has no `onPress` handler | Info | Intended placeholder (opacity: 0.5, disabled by design per plan spec). Not a bug. |

---

### Notable Deviations from Plans (Documented in Summaries)

1. **NativeTabs replaced with standard Expo Router Tabs**: `expo-router/unstable-native-tabs` caused runtime issues during visual verification. Fallback to `<Tabs>` with Ionicons was the documented contingency in `07-RESEARCH.md`. This is architecturally equivalent for the phase goal.

2. **`numberOfTaps(2)` instead of `numberOfTaps(3)`**: Triple-tap was too unreliable in testing. Double-tap now activates the dev panel. Documented decision in `07-03-SUMMARY.md`.

3. **`BottomSheet` replaced with `BottomSheetModal`**: Portal-based modal renders above the tab bar without z-index hacks. This satisfies NAV-04 more robustly than a non-portal sheet.

4. **`profile.tsx` moved from `app/(main)/` to `app/`**: Prevented profile from appearing as a fifth tab. Correct architectural fix.

5. **`BottomSheetModalProvider` added to `app/_layout.tsx`**: Required for portal rendering to work. Not in original plan but necessary for correct behavior.

---

### Human Verification Required

#### 1. Bottom Sheet Renders Above Tab Bar (NAV-04)

**Test:** Launch app on iOS Simulator. Tap any bird marker on the map.
**Expected:** The drawer slides up from the bottom of the screen, appearing visually above the tab bar (tab bar is hidden behind the sheet or the sheet extends edge-to-edge including over the tab area).
**Why human:** Portal rendering order requires device-level testing.

#### 2. Drawer is Full-Width (NAV-03)

**Test:** Open the bird marker drawer. Observe left and right edges.
**Expected:** Drawer fills the full screen width with no horizontal margins — edges flush to screen left and right.
**Why human:** `BottomSheetModal` may have default horizontal insets on iOS. The plan specified `style={{ marginHorizontal: 0 }}` but this was not applied in code.

#### 3. Double-Tap Opens Dev Panel (NAV-02 gesture)

**Test:** From any screen (map, onboarding, paywall), double-tap quickly anywhere on screen.
**Expected:** Dev panel modal slides up. All actions (Reset Onboarding, Go to Map, Show Zustand State, etc.) work.
**Why human:** Gesture conflicts with MapView interactions cannot be statically verified.

#### 4. Content Swap Without Reopen Animation

**Test:** Tap bird marker A to open drawer. Without dismissing, tap bird marker B.
**Expected:** Drawer content updates to bird B's data in place without the sheet closing and reopening.
**Why human:** Requires runtime testing of the `selectedBird` state update path while `BottomSheetModal` is open.

---

### Gaps Summary

No blocking gaps were found. All artifacts exist and are substantively implemented. All key links are wired. TypeScript compiles clean (`npx tsc --noEmit` exits 0).

The four items flagged for human verification are behavioral/visual concerns that require runtime testing on a device or simulator. None are expected to be blocking based on static analysis, but NAV-03 (full-width drawer) carries the highest uncertainty given the missing `marginHorizontal: 0` style from the plan spec.

---

_Verified: 2026-03-10T15:00:00Z_
_Verifier: Claude (gsd-verifier)_

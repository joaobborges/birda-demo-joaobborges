---
phase: 07-native-tabs-map-drawer
plan: 03
subsystem: ui
tags: [react-native, expo-router, bottom-sheet, gorhom, maps, navigation]

# Dependency graph
requires:
  - phase: 07-native-tabs-map-drawer
    provides: "NativeTabs layout, selectedBird state in map screen (07-01)"
  - phase: 07-native-tabs-map-drawer
    provides: "BottomSheet library wired into map (07-01, 07-02 research)"
provides:
  - "BirdDrawerContent component — full-width drawer content with bird info and Pressable image"
  - "BottomSheetModalProvider at root layout level for portal rendering above tab bar"
  - "bird-detail.tsx root screen — scrollable bird detail with hero image, static map, CTA"
  - "Two-step bird info flow: marker tap -> drawer preview -> full detail push screen"
  - "profile.tsx moved from (main)/ to root app/ — renders as stack screen not a tab"
affects:
  - navigation
  - map-screen
  - bird-detail

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "BottomSheetModalProvider wraps root GestureHandlerRootView for portal rendering"
    - "backdropComponent=undefined for map-interactive drawer (no overlay)"
    - "Bird detail at root app/ level (not inside (main)/) to avoid tab routing conflicts"
    - "handleBirdImagePress closes sheet then pushes route — dismisses drawer before navigation"
    - "Profile screen at root app/ level — back arrow only via Stack.Screen options"

key-files:
  created:
    - src/components/map/BirdDrawerContent.tsx
    - app/bird-detail.tsx
    - app/profile.tsx
  modified:
    - app/(main)/index.tsx
    - app/_layout.tsx
    - app/(main)/_layout.tsx

key-decisions:
  - "backdropComponent=undefined (not null) — TypeScript type for BottomSheet requires undefined for no backdrop"
  - "BottomSheet as last child in container View — renders above floating icons without z-index hacks (NAV-04)"
  - "Bird detail at root app/ level — avoids tab push routing conflicts per research recommendation"
  - "Sheet close before router.push — avoids animation conflict between drawer close and screen push"
  - "NativeTabs replaced with standard Expo Router Tabs post-checkpoint — NativeTabs caused runtime issues during visual verification"
  - "BottomSheetModalProvider added to root _layout.tsx — required for BottomSheetModal portal to render above tab bar"
  - "profile.tsx moved from app/(main)/ to app/ — was incorrectly appearing as a tab"
  - "Dev panel trigger changed from triple-tap (3 taps) to double-tap (2 taps) — triple tap too unreliable in testing"

patterns-established:
  - "BirdDrawerContent: Pressable wrapping expo-image for tap-to-detail navigation"
  - "rarityStyles Record<Bird['rarity'], ViewStyle> map reused across drawer and detail screen"
  - "Root-level screens (profile, bird-detail) defined in Stack.Screen in root _layout.tsx"

requirements-completed: [NAV-03, NAV-04, NAV-05]

# Metrics
duration: 8min
completed: 2026-03-10
---

# Phase 07 Plan 03: Bird Drawer + Detail Screen Summary

**Full-width @gorhom/bottom-sheet bird drawer on map with swipe-to-dismiss and scrollable bird detail push screen covering NAV-03/04/05; post-checkpoint fixes migrated NativeTabs to standard Expo Router Tabs and added BottomSheetModalProvider**

## Performance

- **Duration:** 8 min (auto tasks) + post-checkpoint orchestrator fixes
- **Started:** 2026-03-10T14:16:34Z
- **Completed:** 2026-03-10
- **Tasks:** 3/3 complete (Task 3 human-verify approved)
- **Files modified:** 6

## Accomplishments
- BirdDrawerContent component renders bird image (Pressable), name, species, description, and rarity badge inside BottomSheet
- Map screen wired with BottomSheet ref: marker tap opens 50% sheet, swipe-to-dismiss clears selectedBird, image tap pushes bird-detail
- bird-detail.tsx at root level: hero image, back button, name/rarity row, species/description, habitat section, static MapView, disabled CTA
- BottomSheetModalProvider added to root layout for correct portal rendering above tab bar
- NativeTabs swapped for standard Expo Router Tabs after runtime issues during visual verification
- profile.tsx moved to root app/ so it is a stack push screen rather than a tab

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BirdDrawerContent and wire BottomSheet into map** - `a8e679a` (feat)
2. **Task 2: Create bird detail screen** - `ec1c91b` (feat)
3. **Task 3: Visual verification + post-checkpoint fixes** - committed in final metadata commit

**Plan metadata (pre-checkpoint):** `107357f` (docs: complete bird drawer and detail screen plan)

## Files Created/Modified
- `src/components/map/BirdDrawerContent.tsx` — Drawer content component with bird info and Pressable image tap handler
- `app/(main)/index.tsx` — Map screen: BirdMarker onPress -> handleBirdPress, BottomSheet as last child
- `app/bird-detail.tsx` — Full scrollable bird detail screen at root app level
- `app/_layout.tsx` — Added BottomSheetModalProvider wrapper, Stack.Screen for profile, triple-tap -> double-tap
- `app/(main)/_layout.tsx` — NativeTabs replaced with standard Expo Router Tabs using Ionicons
- `app/profile.tsx` — Profile screen moved from app/(main)/profile.tsx to root (back arrow only, no title)

## Decisions Made
- `backdropComponent=undefined` not `null` — TypeScript type `FC<BottomSheetBackdropProps> | undefined` does not accept null
- BottomSheet as last child in container View — renders above floating icons without extra z-index needed (NAV-04)
- Bird detail at root `app/` level — avoids tab routing conflicts as noted in plan research
- Close sheet before push route — prevents animation conflict on image tap
- NativeTabs replaced by standard Expo Router Tabs — NativeTabs (alpha) caused runtime issues during visual verification; fallback to restyled Tabs was the planned contingency
- profile.tsx moved to root — was appearing as a fourth tab in (main)/ group, should be a stack push

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed backdropComponent null TypeScript error**
- **Found during:** Task 1 (TypeScript verification)
- **Issue:** `backdropComponent={null}` causes TS2322 — type `null` not assignable to `FC<BottomSheetBackdropProps> | undefined`
- **Fix:** Changed to `backdropComponent={undefined}` — functionally identical, type-correct
- **Files modified:** app/(main)/index.tsx
- **Verification:** `npx tsc --noEmit` passes clean
- **Committed in:** a8e679a (Task 1 commit)

**2. [Rule 1 - Bug] NativeTabs replaced with standard Expo Router Tabs post-checkpoint**
- **Found during:** Task 3 (visual verification on iOS Simulator)
- **Issue:** NativeTabs (alpha) caused runtime issues during visual verification; tab bar did not render correctly
- **Fix:** Replaced NativeTabs with standard Expo Router `<Tabs>` using Ionicons — the planned fallback per 07-RESEARCH.md
- **Files modified:** app/(main)/_layout.tsx
- **Verification:** App launched successfully with 4-tab bar on iOS Simulator
- **Committed in:** post-checkpoint metadata commit

**3. [Rule 2 - Missing Critical] Added BottomSheetModalProvider to root layout**
- **Found during:** Task 3 (visual verification)
- **Issue:** BottomSheet drawer was rendering behind the tab bar instead of above it
- **Fix:** Added `BottomSheetModalProvider` wrapping root layout in app/_layout.tsx for portal rendering
- **Files modified:** app/_layout.tsx
- **Verification:** Drawer renders above tab bar during visual verification
- **Committed in:** post-checkpoint metadata commit

**4. [Rule 1 - Bug] Moved profile.tsx from (main)/ to root app/**
- **Found during:** Task 3 (visual verification)
- **Issue:** profile.tsx inside app/(main)/ was appearing as a tab in the tab bar
- **Fix:** Deleted app/(main)/profile.tsx, created app/profile.tsx, added Stack.Screen with headerShown: true and no title
- **Files modified:** app/_layout.tsx, app/profile.tsx (new), app/(main)/profile.tsx (deleted)
- **Verification:** Profile accessible via navigation but not visible in tab bar
- **Committed in:** post-checkpoint metadata commit

---

**Total deviations:** 4 auto-fixed (2 Rule 1 bugs, 1 Rule 2 missing critical, 1 Rule 1 relocation bug)
**Impact on plan:** NativeTabs -> Tabs swap was the planned fallback (not scope creep). Other fixes necessary for correct tab/drawer/navigation behavior.

## Issues Encountered
- NativeTabs alpha instability confirmed during visual verification — fallback to standard Expo Router Tabs worked as planned contingency
- BottomSheet portal required BottomSheetModalProvider at root level to render above tab bar

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- All 3 tasks complete, Task 3 human-verify approved
- NAV-03, NAV-04, NAV-05 requirements satisfied
- Phase 07 is complete — 4-tab navigation, bird drawer, bird detail screen, dev panel all working
- NativeTabs fallback successfully activated; alpha library should be flagged for future removal if standard Tabs suffices

---
*Phase: 07-native-tabs-map-drawer*
*Completed: 2026-03-10*

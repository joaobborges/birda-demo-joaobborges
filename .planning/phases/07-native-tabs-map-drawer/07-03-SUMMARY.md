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
  - "BottomSheet wired into map screen with snapToIndex/close, no backdrop overlay"
  - "bird-detail.tsx root screen — scrollable bird detail with hero image, static map, CTA"
  - "Two-step bird info flow: marker tap -> drawer preview -> full detail push screen"
affects:
  - navigation
  - map-screen
  - bird-detail

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "BottomSheet always mounted (never conditionally rendered), controlled via ref.snapToIndex/close"
    - "backdropComponent=undefined for map-interactive drawer (no overlay)"
    - "Bird detail at root app/ level (not inside (main)/) to avoid NativeTabs routing conflicts"
    - "handleBirdImagePress closes sheet then pushes route — dismisses drawer before navigation"

key-files:
  created:
    - src/components/map/BirdDrawerContent.tsx
    - app/bird-detail.tsx
  modified:
    - app/(main)/index.tsx

key-decisions:
  - "backdropComponent=undefined (not null) — TypeScript type for BottomSheet requires undefined for no backdrop"
  - "BottomSheet as last child in container View — renders above floating icons without z-index hacks (NAV-04)"
  - "Bird detail at root app/ level — avoids NativeTabs push routing conflicts per research recommendation"
  - "Sheet close before router.push — avoids animation conflict between drawer close and screen push"

patterns-established:
  - "BirdDrawerContent: Pressable wrapping expo-image for tap-to-detail navigation"
  - "rarityStyles Record<Bird['rarity'], ViewStyle> map reused across drawer and detail screen"

requirements-completed: [NAV-03, NAV-04, NAV-05]

# Metrics
duration: 8min
completed: 2026-03-10
---

# Phase 07 Plan 03: Bird Drawer + Detail Screen Summary

**Full-width @gorhom/bottom-sheet bird drawer on map with swipe-to-dismiss and scrollable bird detail push screen covering NAV-03/04/05**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-10T14:16:34Z
- **Completed:** 2026-03-10T14:24:00Z
- **Tasks:** 2/3 complete (Task 3 is human-verify checkpoint)
- **Files modified:** 3

## Accomplishments
- BirdDrawerContent component renders bird image (Pressable), name, species, description, and rarity badge inside BottomSheet
- Map screen wired with BottomSheet ref: marker tap opens 50% sheet, swipe-to-dismiss clears selectedBird, image tap pushes bird-detail
- bird-detail.tsx at root level: hero image, back button, name/rarity row, species/description, habitat section, static MapView, disabled CTA

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BirdDrawerContent and wire BottomSheet into map** - `a8e679a` (feat)
2. **Task 2: Create bird detail screen** - `ec1c91b` (feat)
3. **Task 3: Visual verification** - awaiting human checkpoint

## Files Created/Modified
- `src/components/map/BirdDrawerContent.tsx` — Drawer content component with bird info and Pressable image tap handler
- `app/(main)/index.tsx` — Map screen updated: BirdMarker onPress -> handleBirdPress, BottomSheet added as last child with snapToIndex/close control
- `app/bird-detail.tsx` — Full scrollable bird detail screen at root app level

## Decisions Made
- `backdropComponent=undefined` not `null` — TypeScript type `FC<BottomSheetBackdropProps> | undefined` does not accept null
- BottomSheet as last child in container View — renders above floating icons without extra z-index needed (NAV-04)
- Bird detail at root `app/` level — avoids NativeTabs routing conflicts as noted in plan research
- Close sheet before push route — prevents animation conflict on image tap

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed backdropComponent null TypeScript error**
- **Found during:** Task 1 (TypeScript verification)
- **Issue:** `backdropComponent={null}` causes TS2322 — type `null` not assignable to `FC<BottomSheetBackdropProps> | undefined`
- **Fix:** Changed to `backdropComponent={undefined}` — functionally identical, type-correct
- **Files modified:** app/(main)/index.tsx
- **Verification:** `npx tsc --noEmit` passes clean
- **Committed in:** a8e679a (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug, TypeScript type mismatch)
**Impact on plan:** Trivial type fix, no behavior change. No scope creep.

## Issues Encountered
None beyond the TypeScript type fix above.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Two auto-tasks complete and committed; awaiting Task 3 human-verify checkpoint
- Once visual verification passes, all NAV-01 through NAV-05 requirements are satisfied
- Phase 07 will be complete after checkpoint approval

---
*Phase: 07-native-tabs-map-drawer*
*Completed: 2026-03-10*

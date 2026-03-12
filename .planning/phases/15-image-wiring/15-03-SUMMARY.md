---
phase: 15-image-wiring
plan: 03
subsystem: ui
tags: [expo-image, react-native-maps, typography, image-cropping, map-pins]

# Dependency graph
requires:
  - phase: 15-image-wiring
    provides: Bird.image type as ImageSource, imageManifest.ts, screen wiring for all bird images
provides:
  - Tappable map markers without oversized annotation hit area
  - Bird images with contentPosition=top for head visibility across all components
  - Name screen heading using typography.h3 matching other onboarding screens
affects: [map, community, bird-detail, welcome, onboarding]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "contentPosition=top on all bird expo-image components for consistent head visibility"
    - "Marker direct children (no wrapping View) for correct iOS native annotation tappability"

key-files:
  created: []
  modified:
    - src/components/map/BirdMarker.tsx
    - src/components/welcome/BirdMosaic.tsx
    - src/components/map/BirdInfoCard.tsx
    - src/components/map/BirdDrawerContent.tsx
    - app/bird-detail.tsx
    - app/(main)/community.tsx
    - app/(onboarding)/name.tsx

key-decisions:
  - "No hitSlop alternative added to BirdMarker — original 14-18px markers worked correctly before regression, restoring direct children is sufficient"
  - "contentFit=cover retained on all bird images; only contentPosition=top added"

patterns-established:
  - "All bird photo Image components: contentFit=cover + contentPosition=top"
  - "BirdMarker: marker shape Views are direct Marker children, no wrapper"

requirements-completed: [IMG-01, IMG-04, IMG-05]

# Metrics
duration: 3min
completed: 2026-03-12
---

# Phase 15 Plan 03: UAT Gap Closure Summary

**Map pin tap regression fixed, bird head visibility restored across 5 components, and name screen heading aligned to typography.h3**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-12T09:14:50Z
- **Completed:** 2026-03-12T09:17:28Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Restored BirdMarker tap detection on iOS by removing 44x44 hitArea View wrapper that caused overlapping transparent annotation
- Added contentPosition="top" to all 5 bird-photo Image components (BirdMosaic x2, BirdInfoCard, BirdDrawerContent, bird-detail, community) ensuring bird heads remain visible
- Replaced name screen heading override (subheading+bold+24px) with typography.h3 (Rubik_400Regular/26px), matching goals/discover onboarding pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix map pin tappability by removing hitArea wrapper** - `883d715` (fix)
2. **Task 2: Add contentPosition top to all bird image components** - `60ed0fa` (fix)
3. **Task 3: Fix name screen heading to use typography.h3** - `115df25` (fix)

## Files Created/Modified
- `src/components/map/BirdMarker.tsx` - Removed hitArea wrapper and StyleSheet entry; marker shapes are now direct Marker children
- `src/components/welcome/BirdMosaic.tsx` - Added contentPosition="top" to both tile Image instances
- `src/components/map/BirdInfoCard.tsx` - Added contentPosition="top" to bird image
- `src/components/map/BirdDrawerContent.tsx` - Added contentPosition="top" to bird image
- `app/bird-detail.tsx` - Added contentPosition="top" to hero image
- `app/(main)/community.tsx` - Added contentPosition="top" to sighting list image
- `app/(onboarding)/name.tsx` - Replaced heading style with typography.h3; removed fontWeights import

## Decisions Made
- No hitSlop alternative was added to BirdMarker — the plan explicitly noted the original markers worked before the regression, so restoring direct children is the correct minimal fix.
- fontWeights import removed from name.tsx after it became unused following the heading style change.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all three fixes were straightforward and all three builds passed on first attempt.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 3 UAT gaps from phase 15 are closed
- App is ready for final visual verification: tap any bird pin to confirm BirdInfoCard opens, check bird heads in mosaic/cards, compare name screen heading to goals screen
- No blockers for subsequent phases

## Self-Check: PASSED
- All 7 modified files exist on disk
- All 3 task commits verified in git log (883d715, 60ed0fa, 115df25)
- SUMMARY.md created at .planning/phases/15-image-wiring/15-03-SUMMARY.md

---
*Phase: 15-image-wiring*
*Completed: 2026-03-12*

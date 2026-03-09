---
phase: 02-onboarding-and-paywall
plan: 05
subsystem: ui
tags: [react-native, reanimated, animation, onboarding, paywall]

requires:
  - phase: 02-onboarding-and-paywall
    provides: "OnboardingLayout with illustration prop, birding journey screen, paywall toggle"
provides:
  - "Dynamic avatar rendering based on birding experience level selection"
  - "Smooth paywall toggle animation with cubic ease-out"
affects: []

tech-stack:
  added: []
  patterns: ["AVATAR_MAP lookup pattern for dynamic visual config", "withTiming ease-out for smooth UI transitions"]

key-files:
  created: []
  modified:
    - app/(onboarding)/birding-journey.tsx
    - app/(onboarding)/paywall.tsx

key-decisions:
  - "Emoji placeholders used for avatar since no real bird assets available -- demonstrates dynamic behavior"
  - "280ms ease-out cubic chosen over spring for smoother, non-bouncy toggle feel"

patterns-established:
  - "AVATAR_MAP record pattern: Record<Key, VisualConfig> for mapping selection state to visual output"

requirements-completed: [ONBR-03, PAYW-02, PAYW-03]

duration: 1min
completed: 2026-03-09
---

# Phase 02 Plan 05: Dynamic Avatar & Smooth Toggle Summary

**Dynamic emoji avatar that changes per birding experience level, plus paywall toggle smoothed with withTiming ease-out cubic replacing bouncy withSpring**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-09T12:22:02Z
- **Completed:** 2026-03-09T12:23:18Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Birding journey avatar dynamically renders different emoji and size per experience level (egg, bird, eagle, owl)
- Avatar wrapped in Animated.View with FadeIn re-mount animation on selection change
- Paywall toggle replaced withSpring(damping:15) with withTiming(280ms, ease-out cubic) for smooth non-bouncy transition

## Task Commits

Each task was committed atomically:

1. **Task 1: Dynamic avatar for birding journey and smooth paywall toggle** - `dd919b0` (feat)

## Files Created/Modified
- `app/(onboarding)/birding-journey.tsx` - Added AVATAR_MAP, dynamic emoji rendering, FadeIn animation on selection change
- `app/(onboarding)/paywall.tsx` - Replaced withSpring with withTiming(280ms, Easing.out(Easing.cubic))

## Decisions Made
- Used emoji placeholders for avatar visuals since no real bird illustration assets are available -- demonstrates the dynamic selection behavior
- 280ms duration with ease-out cubic curve chosen for toggle animation -- smooth and subtle without bounce

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript error in src/theme/index.ts (widgetSpacing export) unrelated to this plan's changes -- not addressed per scope boundary rules

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All Phase 02 onboarding/paywall UAT gaps are now closed
- Ready for Phase 03 (map and explore features)

---
*Phase: 02-onboarding-and-paywall*
*Completed: 2026-03-09*

---
phase: 02-onboarding-and-paywall
plan: 03
subsystem: ui
tags: [react-native, reanimated, paywall, onboarding, borderCurve, adaptive-toggle]

# Dependency graph
requires:
  - phase: 02-onboarding-and-paywall/01
    provides: OnboardingLayout, onboarding store with name/birdingJourney/goals, ProgressDots
provides:
  - Redesigned paywall with hero image, adaptive-width toggle, personalized headline
  - Post-paywall reminders screen
  - Post-paywall mailing list screen with toggle switch
  - borderCurve: continuous applied globally across all borderRadius in the app
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Adaptive toggle using onLayout measurements and useSharedValue instead of hardcoded widths"
    - "borderCurve: continuous alongside every borderRadius for iOS continuous corners"
    - "Measured flag pattern to prevent flash-on-mount for layout-dependent animations"

key-files:
  created:
    - app/(onboarding)/reminders.tsx
    - app/(onboarding)/mailing-list.tsx
  modified:
    - app/(onboarding)/paywall.tsx
    - src/components/dev/DevPanel.tsx
    - app/(main)/index.tsx
    - app/(main)/profile.tsx
    - src/theme/components.ts

key-decisions:
  - "Used Option A (negative margin) for hero image breakout to maintain OnboardingLayout usage"
  - "Measured shared value flag pattern to handle toggle indicator opacity on mount"

patterns-established:
  - "borderCurve sweep: every borderRadius must have adjacent borderCurve: continuous"
  - "Post-paywall screens use OnboardingLayout with no header"

requirements-completed: [PAYW-01, PAYW-02, PAYW-03, STYL-01]

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 2 Plan 3: Paywall Redesign & Post-Paywall Screens Summary

**Redesigned paywall with adaptive-width toggle, hero image, and personalized headline; added reminders and mailing-list post-paywall screens; applied borderCurve: continuous across all borderRadius in the app**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T11:44:32Z
- **Completed:** 2026-03-09T11:48:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Paywall redesigned with full-bleed hero image, adaptive-width toggle (onLayout measurements), and personalized headline
- Nature Day variant shows teal hero and promotional banner with 20% off pricing
- Reminders and mailing-list screens complete the post-paywall flow before home
- borderCurve: continuous applied to every borderRadius across the entire app (STYL-01)

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign paywall with hero image, adaptive toggle, and personalization** - `48e2edf` (feat)
2. **Task 2: Create post-paywall screens and borderCurve sweep** - `caf3c1f` (feat)

## Files Created/Modified
- `app/(onboarding)/paywall.tsx` - Redesigned paywall with hero image, adaptive toggle, personalized headline, Nature Day variant
- `app/(onboarding)/reminders.tsx` - Post-paywall reminders screen with Remind me / Maybe later
- `app/(onboarding)/mailing-list.tsx` - Post-paywall mailing list with toggle switch (off by default), calls completeOnboarding
- `src/components/dev/DevPanel.tsx` - Added borderCurve to trigger button
- `app/(main)/index.tsx` - Added borderCurve to iconButton, notificationBadge, infoCardClose, rarityBadge
- `app/(main)/profile.tsx` - Added borderCurve to avatar
- `src/theme/components.ts` - Added borderCurve to all button presets

## Decisions Made
- Used Option A (negative margin -24) for hero image breakout from OnboardingLayout padding, maintaining ONBR-02 compliance
- Used a measured shared value counter to prevent toggle indicator flash-on-mount (opacity 0 until both widths measured)
- completeOnboarding called only from mailing-list screen (last screen in flow)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TS error in src/theme/index.ts (widgetSpacing export) unrelated to this plan's changes -- not addressed (out of scope)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Full 11-screen onboarding flow complete: welcome -> tour (4) -> quiz (3) -> paywall -> reminders -> mailing-list -> home
- borderCurve sweep complete across entire app
- Ready for Phase 3 or any remaining Phase 2 plans

---
*Phase: 02-onboarding-and-paywall*
*Completed: 2026-03-09*

## Self-Check: PASSED

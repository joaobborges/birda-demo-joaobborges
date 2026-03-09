---
phase: 02-onboarding-and-paywall
plan: 04
subsystem: ui
tags: [react-native, onboarding, layout, scroll-view, status-bar, button-variants]

# Dependency graph
requires:
  - phase: 02-onboarding-and-paywall
    provides: OnboardingLayout component, Button component, onboarding screen structure
provides:
  - Full-bleed illustration zone in OnboardingLayout
  - Pinned footer outside ScrollView
  - Ghost button variant
  - Translucent status bar configuration
affects: [02-onboarding-and-paywall, paywall, onboarding-screens]

# Tech tracking
tech-stack:
  added: []
  patterns: [illustration-slot-layout, pinned-footer-outside-scroll, percentage-height-via-dimensions]

key-files:
  created: []
  modified:
    - src/components/onboarding/OnboardingLayout.tsx
    - src/components/ui/Button.tsx
    - src/theme/components.ts
    - app/(onboarding)/_layout.tsx
    - app/(onboarding)/welcome.tsx
    - app/(onboarding)/ai-bird-id.tsx
    - app/(onboarding)/green-time.tsx
    - app/(onboarding)/discover.tsx
    - app/(onboarding)/community.tsx
    - app/(onboarding)/goals.tsx
    - app/(onboarding)/paywall.tsx

key-decisions:
  - "Illustration heights use Dimensions.get('window').height * percentage instead of CSS-style percentage strings (RN limitation with non-deterministic parent heights)"
  - "Paywall banner emoji removed in favor of text-only Nature Day banner"

patterns-established:
  - "Illustration slot pattern: screens pass illustration ReactNode to OnboardingLayout for full-bleed rendering"
  - "Footer pinning: footer prop renders outside ScrollView, always visible at bottom"

requirements-completed: [ONBR-01, ONBR-02, PAYW-01, STYL-01]

# Metrics
duration: 3min
completed: 2026-03-09
---

# Phase 02 Plan 04: Full-Bleed Layout & Ghost Button Summary

**Two-zone OnboardingLayout with full-bleed illustration slot, ScrollView-wrapped content, pinned footer, and ghost button variant for login**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-09T12:16:32Z
- **Completed:** 2026-03-09T12:19:26Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- OnboardingLayout restructured into illustration zone + scrollable content + pinned footer
- Ghost button variant added with same container dimensions as primary (transparent bg)
- Status bar configured translucent so hero images render behind it
- All 7 onboarding screens updated to use illustration prop for full-bleed images

## Task Commits

Each task was committed atomically:

1. **Task 1: Restructure OnboardingLayout, add ghost Button, configure translucent status bar** - `b2940f2` (feat)
2. **Task 2: Update all onboarding screens to use full-bleed illustration slot and pinned footer** - `4602544` (feat)

## Files Created/Modified
- `src/components/onboarding/OnboardingLayout.tsx` - Two-zone layout: illustration slot + ScrollView content + pinned footer
- `src/components/ui/Button.tsx` - Added ghost variant alongside primary/secondary
- `src/theme/components.ts` - Added ghost token to buttons map
- `app/(onboarding)/_layout.tsx` - Translucent status bar via expo-status-bar
- `app/(onboarding)/welcome.tsx` - Full-bleed illustration, ghost login button, marginBottom on checkbox
- `app/(onboarding)/ai-bird-id.tsx` - Illustration prop with 50% screen height
- `app/(onboarding)/green-time.tsx` - Illustration prop with 50% screen height
- `app/(onboarding)/discover.tsx` - Illustration prop with 50% screen height
- `app/(onboarding)/community.tsx` - Illustration prop with 50% screen height
- `app/(onboarding)/goals.tsx` - Illustration prop with 40% screen height replacing circular avatar
- `app/(onboarding)/paywall.tsx` - Hero moved to illustration prop, action buttons moved to footer

## Decisions Made
- Used `Dimensions.get('window').height * percentage` instead of string percentages for illustration heights (React Native percentage heights require deterministic parent height)
- Removed emoji from paywall Nature Day banner text for consistency

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed percentage height rendering in illustration zones**
- **Found during:** Task 2 (updating onboarding screens)
- **Issue:** Plan specified `height: '50%'` string style but React Native percentage heights require parent to have deterministic height; the illustrationZone wrapper has no fixed height so children with percentage heights resolve to 0
- **Fix:** Used `Dimensions.get('window').height * 0.5` (and 0.45, 0.4 for welcome/goals) for reliable screen-relative heights
- **Files modified:** All 6 screen files using illustration prop
- **Verification:** TypeScript compiles without errors
- **Committed in:** `4602544` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for correct rendering. No scope creep.

## Issues Encountered
- Pre-existing TypeScript error for `widgetSpacing` export in `src/theme/index.ts` unrelated to this plan's changes (out of scope)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full-bleed layout architecture in place for all onboarding screens
- Ghost button variant available for future use
- Ready for visual polish and remaining UAT gap closure

## Self-Check: PASSED

All 11 modified files verified. Both task commits (b2940f2, 4602544) confirmed in git log.

---
*Phase: 02-onboarding-and-paywall*
*Completed: 2026-03-09*

---
phase: 04-design-system-onboarding-polish
plan: 01
subsystem: ui
tags: [rubik, expo-font, splash-screen, typography, react-native, design-tokens]

requires:
  - phase: 01-foundation
    provides: Theme barrel (src/theme/index.ts) and typography token structure
provides:
  - Weight-specific Rubik font family tokens (fontWeights map)
  - Build-time font embedding via expo-font config plugin
  - Birda logo splash screen with 500ms minimum display
  - fixedBottomCTA container style for bottom-anchored CTAs
  - Clean theme barrel exports (removed broken widgetSpacing)
affects: [04-02, 04-03, onboarding-screens, bottom-sheet-layouts]

tech-stack:
  added: [@expo-google-fonts/rubik]
  patterns: [weight-specific-font-families, build-time-font-embedding, splash-delay-pattern]

key-files:
  created: []
  modified:
    - app.json
    - src/theme/typography.ts
    - src/theme/components.ts
    - src/theme/index.ts
    - app/_layout.tsx
    - package.json

key-decisions:
  - "Font weights encoded in family name (Rubik_400Regular) instead of separate fontWeight property -- required for React Native static font loading"
  - "500ms splash delay via setTimeout before hideAsync -- user-specified minimum display time"

patterns-established:
  - "Weight-specific font families: use fontWeights.regular/medium/semiBold instead of fontWeight CSS property"
  - "Container styles in components.ts: layout containers (fixedBottomCTA) exported alongside buttons and borderRadius"

requirements-completed: [FOUN-05, FOUN-06, FOUN-09]

duration: 2min
completed: 2026-03-09
---

# Phase 4 Plan 1: Font & Splash Foundation Summary

**Build-time Rubik font embedding with 5 weight variants, Birda logo splash screen with fade delay, and fixedBottomCTA container token**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T17:10:20Z
- **Completed:** 2026-03-09T17:12:01Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Installed @expo-google-fonts/rubik and configured expo-font plugin for build-time embedding of 5 weight variants (300-700)
- Rewrote typography.ts to use weight-specific font family names, removing all fontWeight properties
- Added fixedBottomCTA container style and fixed broken widgetSpacing export in theme barrel
- Configured splash screen with Birda logo and 500ms minimum display time

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Rubik font, configure app.json, rewrite typography tokens** - `a9026fc` (feat)
2. **Task 2: Add fixedBottomCTA, fix widgetSpacing, splash delay** - `16eb833` (feat)

## Files Created/Modified
- `app.json` - Added expo-font config plugin with 5 Rubik TTF paths, updated splash to bird-logo.png
- `src/theme/typography.ts` - Rewritten with fontWeights map and weight-specific family names
- `src/theme/components.ts` - Added containers.fixedBottomCTA style
- `src/theme/index.ts` - Fixed broken widgetSpacing export, added containers and fontWeights exports
- `app/_layout.tsx` - Added 500ms setTimeout before SplashScreen.hideAsync()
- `package.json` - Added @expo-google-fonts/rubik dependency

## Decisions Made
- Font weights encoded in family name (Rubik_400Regular) instead of separate fontWeight property -- required for React Native static font loading
- 500ms splash delay via setTimeout before hideAsync -- user-specified minimum display time

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. Note: visual font changes require EAS rebuild.

## Next Phase Readiness
- Typography tokens ready for weight-specific rendering across all screens
- fixedBottomCTA container available for Plan 02 (onboarding polish) and Plan 03 (bottom sheet)
- Splash screen configured -- will show Birda logo after next EAS build

---
*Phase: 04-design-system-onboarding-polish*
*Completed: 2026-03-09*

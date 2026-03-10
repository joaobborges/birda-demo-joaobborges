---
phase: 08-auth-fix-ui-polish
plan: 02
subsystem: ui
tags: [react-native, bottom-sheet, keyboard-avoiding-view, onboarding, auth-drawer]

# Dependency graph
requires:
  - phase: 05-welcome-auth-screen
    provides: AuthDrawer component and OnboardingLayout used throughout onboarding
provides:
  - Full-screen backdrop coverage for auth drawer using StyleSheet.absoluteFillObject
  - Top-aligned onboarding content matching welcome screen vertical positioning
  - Keyboard-aware name input screen
affects: [onboarding, auth-drawer, welcome-screen]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "StyleSheet.absoluteFillObject in BottomSheetBackdrop style prop to break out of sheet's layer"
    - "KeyboardAvoidingView wrapping OnboardingLayout for keyboard push-up on iOS and Android"
    - "paddingTop instead of justifyContent center for top-aligned scroll content"

key-files:
  created: []
  modified:
    - src/components/welcome/AuthDrawer.tsx
    - src/components/onboarding/OnboardingLayout.tsx
    - app/(onboarding)/name.tsx

key-decisions:
  - "08-02: absoluteFillObject on BottomSheetBackdrop style prop extends backdrop to full parent view (GestureHandlerRootView)"
  - "08-02: paddingTop: spacing[6] replaces justifyContent center in OnboardingLayout — propagates top-alignment to all onboarding screens"
  - "08-02: KeyboardAvoidingView wraps OnboardingLayout (not inside it) so it can control full flex layout"

patterns-established:
  - "Pattern: BottomSheet backdrop full-screen override via style={[props.style, StyleSheet.absoluteFillObject]}"

requirements-completed: [AUTH-01]

# Metrics
duration: 1min
completed: 2026-03-10
---

# Phase 8 Plan 02: Auth Fix & UI Polish - Backdrop and Layout Alignment Summary

**Full-screen auth drawer backdrop via absoluteFillObject and top-aligned onboarding layout with keyboard avoidance on name screen**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-10T15:38:03Z
- **Completed:** 2026-03-10T15:39:18Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Auth drawer backdrop now covers full screen including the bird mosaic area above the sheet (50% black opacity overlay visible above gradient and scrolling columns)
- OnboardingLayout scrollContent changed from vertically-centered to top-aligned — consistent with welcome screen's textSection positioning across all onboarding screens (ai-bird-id, name, location, stay-in-the-loop, mailing-list)
- Name screen wrapped in KeyboardAvoidingView with iOS 'padding' and Android 'height' behaviors for keyboard push-up

## Task Commits

Each task was committed atomically:

1. **Task 1: Auth drawer full-screen backdrop fix** - `b76428c` (feat)
2. **Task 2: OnboardingLayout alignment + name screen keyboard avoidance** - `e36912a` (feat)

## Files Created/Modified
- `src/components/welcome/AuthDrawer.tsx` - Added `style={[props.style, StyleSheet.absoluteFillObject]}` to BottomSheetBackdrop
- `src/components/onboarding/OnboardingLayout.tsx` - Replaced `justifyContent: 'center'` with `paddingTop: spacing['6']` in scrollContent
- `app/(onboarding)/name.tsx` - Wrapped OnboardingLayout in KeyboardAvoidingView with platform-specific behavior

## Decisions Made
- `absoluteFillObject` applied to `style` prop of `BottomSheetBackdrop` (not as a separate overlay) — extends the backdrop from BottomSheet's rendering layer to the full parent GestureHandlerRootView which fills the screen
- `paddingTop: spacing['6']` (24px) matches the welcome screen's `textSection.paddingTop` value exactly, ensuring visual consistency
- `KeyboardAvoidingView` wraps the entire `OnboardingLayout` so the flex layout is properly controlled by keyboard avoidance (not inside the scroll container)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing lint error in `app/(main)/index.tsx` (react/jsx-no-leaked-render) discovered during verification. Out of scope for this plan — logged to `deferred-items.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- AUTH-01 fully closed: button options identical for login/signup, backdrop covers full screen
- All onboarding screens consistently aligned to top matching welcome screen
- Name screen keyboard-safe for text entry
- Phase 08 UI polish work is complete

---
*Phase: 08-auth-fix-ui-polish*
*Completed: 2026-03-10*

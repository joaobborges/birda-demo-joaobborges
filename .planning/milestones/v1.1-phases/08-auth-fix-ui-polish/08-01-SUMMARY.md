---
phase: 08-auth-fix-ui-polish
plan: 01
subsystem: ui
tags: [expo-router, react-native-maps, tab-bar, paywall, ionicons]

# Dependency graph
requires:
  - phase: 07-native-tabs-map-drawer
    provides: BirdMarker component, tab layout, map screen with header icons
  - phase: 06-paywall-redesign
    provides: paywall screen layout and social proof boxes
provides:
  - Paywall with real social proof text ("400+ happy birders", "4.7 stars")
  - Paywall unlock pill uses ribbon icon, Nature Day banner is text-only
  - BirdMarker with 44x44 transparent hit area for all rarity variants
  - Tab bar active color is primary blue (#1F87FE)
  - Map header icons (profile, notifications) use neutral400 color
  - Profile and Community headers have no separator line
  - Profile back button shows chevron only (minimal mode)
affects: [future paywall iterations, map UX improvements, navigation polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 44x44 transparent hitArea View wrapping marker content for minimum tap target
    - semantic.actionPrimary for tab active color (not neutral700)
    - headerBackButtonDisplayMode: 'minimal' for chevron-only back buttons
    - headerShadowVisible: false for clean separator-free headers

key-files:
  created: []
  modified:
    - app/(onboarding)/paywall.tsx
    - src/components/map/BirdMarker.tsx
    - app/(main)/_layout.tsx
    - app/(main)/index.tsx
    - app/_layout.tsx

key-decisions:
  - "Social proof boxes show placeholder text until real images are provided — preserves layout, communicates content"
  - "ribbon icon for unlock pill — consistent with feature bullet icons already using ribbon"
  - "hitArea 44x44 centered wrapper on BirdMarker — standard iOS/Android minimum tap target guideline"
  - "headerBackButtonDisplayMode: minimal for profile — cleaner back nav without redundant title label"

patterns-established:
  - "44x44 hitArea pattern: transparent View wrapper with alignItems/justifyContent center around visual marker"
  - "Import semantic alongside colors in layout files that need active state colors"

requirements-completed: [PAYW-06, NAV-03, NAV-04]

# Metrics
duration: 8min
completed: 2026-03-10
---

# Phase 8 Plan 01: UI Polish Summary

**Paywall social proof content, 44x44 map marker tap targets, blue active tab, neutral header icons, and separator-free profile/community headers**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-10T15:38:11Z
- **Completed:** 2026-03-10T15:46:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Paywall now shows real social proof copy ("400+ happy birders", "4.7 stars") with centered text in styled boxes
- Paywall unlock pill uses ribbon icon matching feature bullets; Nature Day banner is text-only (no leaf icon or emoji)
- BirdMarker wraps all rarity variants (common, uncommon, rare) in a 44x44 transparent hit area for easier tapping
- Active tab color changed from neutral700 to semantic.actionPrimary (#1F87FE blue)
- Map header icons (profile, notifications) lightened to colors.neutral400 for reduced visual weight
- Profile and Community screen headers have no bottom separator line; profile back button shows chevron only

## Task Commits

Each task was committed atomically:

1. **Task 1: Paywall content fixes — social proof, icon, banner** - `de3420e` (feat)
2. **Task 2: Map marker hit area + tab/navigation styling** - `5e48bc4` (feat)

## Files Created/Modified
- `app/(onboarding)/paywall.tsx` - Social proof text content, ribbon icon, text-only banner, socialText style
- `src/components/map/BirdMarker.tsx` - 44x44 hitArea wrapper around all marker variants
- `app/(main)/_layout.tsx` - Added semantic import, active tab color to actionPrimary, community headerShadowVisible: false
- `app/(main)/index.tsx` - Header icons color changed to neutral400
- `app/_layout.tsx` - Profile screen headerShadowVisible: false + headerBackButtonDisplayMode: minimal

## Decisions Made
- Social proof boxes use placeholder text (not images) — user can swap in real assets when available, layout already established
- ribbon icon for unlock pill is consistent with feature bullet icons that already use ribbon
- 44x44 hitArea follows Apple HIG and Android minimum recommended tap target (44pt / 48dp)
- `headerBackButtonDisplayMode: 'minimal'` gives chevron-only back button without text label clutter

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed react/jsx-no-leaked-render lint error in index.tsx**
- **Found during:** Task 2 (map/navigation styling)
- **Issue:** `selectedBird && <BirdDrawerContent />` pattern can leak falsy values to React renderer, causing lint error
- **Fix:** Changed to ternary `selectedBird ? <BirdDrawerContent /> : null`
- **Files modified:** app/(main)/index.tsx
- **Verification:** `npx expo lint` passes with no errors after fix
- **Committed in:** 5e48bc4 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Pre-existing lint error fixed as part of touching the file. No scope creep.

## Issues Encountered
None — all changes applied cleanly and lint passes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Paywall content polish complete; social proof boxes ready for image asset replacement
- Map UX improved with minimum tap targets on markers
- Navigation styling consistent across all main screens
- No blockers for remaining phase 08 plans

---
*Phase: 08-auth-fix-ui-polish*
*Completed: 2026-03-10*

## Self-Check: PASSED

- All 5 modified source files: FOUND
- SUMMARY.md: FOUND
- Task 1 commit de3420e: FOUND
- Task 2 commit 5e48bc4: FOUND

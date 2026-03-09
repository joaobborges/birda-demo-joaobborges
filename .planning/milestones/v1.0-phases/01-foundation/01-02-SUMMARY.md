---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [design-tokens, theme, colors, react-native, styling]

# Dependency graph
requires: []
provides:
  - Extended color token system with accent, secondary, status, rarity, and neutral tokens
  - All 14 screen/component files migrated to centralized theme tokens
  - Zero hardcoded hex values in app/ and src/components/
affects: [02-features, 03-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [semantic-tokens, centralized-theme-imports]

key-files:
  created: []
  modified:
    - src/theme/colors.ts
    - app/(onboarding)/welcome.tsx
    - app/(onboarding)/name.tsx
    - app/(onboarding)/location.tsx
    - app/(onboarding)/interests.tsx
    - app/(onboarding)/skill-level.tsx
    - app/(onboarding)/notifications.tsx
    - app/(onboarding)/summary.tsx
    - app/(onboarding)/paywall.tsx
    - app/(main)/index.tsx
    - app/(main)/community.tsx
    - app/(main)/profile.tsx
    - src/components/dev/DevPanel.tsx
    - src/components/onboarding/ProgressDots.tsx
    - src/components/ui/Button.tsx

key-decisions:
  - "Green-tinted selected states (#F0F7F4) replaced with blue-tinted actionPrimaryBg token"
  - "Green inactive dots (#D8E8D4) replaced with borderDefault neutral token"
  - "Paywall 'Best value' badge uses actionPrimary (blue) background instead of green"

patterns-established:
  - "Import pattern: import { semantic, colors } from '@/theme/colors' (direct, not barrel)"
  - "All color references use semantic tokens; raw colors only when no semantic mapping exists"
  - "Page backgrounds always use semantic.bgPage (pure white)"

requirements-completed: [FOUN-01]

# Metrics
duration: 5min
completed: 2026-03-09
---

# Phase 1 Plan 2: Theme Token Migration Summary

**Extended color system with 24 semantic tokens and migrated all 14 screen/component files to zero hardcoded hex values**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-09T10:45:08Z
- **Completed:** 2026-03-09T10:49:48Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- Extended colors.ts with 10 new color primitives (accent, secondary, 3 neutrals, 2 status, 3 rarity) and 12 new semantic mappings (24 total semantic tokens)
- Migrated all 14 files from hardcoded hex to theme token imports -- grep confirms zero remaining hex strings
- Replaced all green-based colors (#1B4332, #2D6A4F, #D8E8D4, #F0F7F4) with birda blue palette tokens
- All page backgrounds now use pure white (#FFFFFF via semantic.bgPage) instead of warm off-white (#FAFAF8)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend theme tokens with missing colors** - `636fe54` (feat)
2. **Task 2: Migrate all 14 files from hardcoded hex to theme tokens** - `633b4db` (feat)

## Files Created/Modified
- `src/theme/colors.ts` - Extended with accent, secondary, neutral, status, and rarity tokens plus semantic mappings
- `app/(onboarding)/welcome.tsx` - Token-migrated welcome screen
- `app/(onboarding)/name.tsx` - Token-migrated name input screen
- `app/(onboarding)/location.tsx` - Token-migrated location input screen
- `app/(onboarding)/interests.tsx` - Token-migrated bird interests selection
- `app/(onboarding)/skill-level.tsx` - Token-migrated skill level selection
- `app/(onboarding)/notifications.tsx` - Token-migrated notifications preferences (switch tracks use blue)
- `app/(onboarding)/summary.tsx` - Token-migrated profile summary screen
- `app/(onboarding)/paywall.tsx` - Token-migrated paywall with blue accent badge
- `app/(main)/index.tsx` - Token-migrated map screen with rarity badges
- `app/(main)/community.tsx` - Token-migrated community sightings list
- `app/(main)/profile.tsx` - Token-migrated profile screen
- `src/components/dev/DevPanel.tsx` - Token-migrated dev panel (close button uses actionPrimary)
- `src/components/onboarding/ProgressDots.tsx` - Token-migrated progress dots (active=blue, inactive=neutral)
- `src/components/ui/Button.tsx` - Token-migrated button (primary=black via actionSecondary)

## Decisions Made
- Green-tinted selected chip/option backgrounds (#F0F7F4) replaced with blue-tinted actionPrimaryBg to maintain brand consistency
- Green inactive progress dots (#D8E8D4) replaced with neutral borderDefault for cleaner look
- Paywall "Best value" badge background changed from green (#2D6A4F) to actionPrimary (blue) for brand alignment
- DevPanel close button text changed from green (#2D6A4F) to actionPrimary (blue)
- Cards and list items in community/profile that used #FFFFFF mapped to semantic.bgPage since they sit on the page background

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added tokens for #F0F7F4 and #D8E8D4 green colors**
- **Found during:** Task 2 (file migration)
- **Issue:** Two green-tinted colors (#F0F7F4 selected state bg, #D8E8D4 inactive dot) existed in codebase but had no token mapping specified in the plan
- **Fix:** Mapped #F0F7F4 to semantic.actionPrimaryBg (blue tinted) and #D8E8D4 to semantic.borderDefault (neutral gray), consistent with green-to-blue brand migration
- **Files modified:** interests.tsx, skill-level.tsx, ProgressDots.tsx
- **Verification:** grep confirms zero hex values remain
- **Committed in:** 633b4db (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Necessary for complete hex elimination. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Complete color token system ready for any future screen or component
- All existing screens use centralized tokens -- future changes only require editing colors.ts
- Font migration not needed -- no files had hardcoded font family strings (Rubik is applied via Expo font loading, not inline styles)

## Self-Check: PASSED

All files verified present. All commit hashes confirmed in git log.

---
*Phase: 01-foundation*
*Completed: 2026-03-09*

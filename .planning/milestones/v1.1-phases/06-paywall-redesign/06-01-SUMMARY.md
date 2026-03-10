---
phase: 06-paywall-redesign
plan: 01
subsystem: ui
tags: [expo, react-native, paywall, onboarding, zustand, ionicons]

# Dependency graph
requires:
  - phase: 05-welcome-screen
    provides: completeOnboarding store action, router.replace navigation pattern
provides:
  - Standalone full-screen paywall with hero, feature bullets, social proof, pricing, CTA, footer links
  - router.replace('/(main)') dismiss pattern — no back-stack return to paywall
affects: [07-polish, any future monetization phase]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Standalone screen layout (no OnboardingLayout wrapper) for conversion-optimized fullscreen
    - handleDismiss pattern — completeOnboarding() called before router.replace()
    - Mixed-weight CTA text via nested Text components (not Button.tsx)
    - Pressable children-as-function pattern for pressed opacity feedback
    - Zone-based layout: hero (fixed height via Dimensions) / body (flex: 1, space-evenly) / footer (fixed)

key-files:
  created: []
  modified:
    - app/(onboarding)/paywall.tsx
    - src/theme/components.ts
    - app/(main)/index.tsx

key-decisions:
  - "Standalone layout (no OnboardingLayout) — conversion screen requires full-screen control per user decision"
  - "router.replace (not push) — prevents back gesture returning to paywall after dismiss"
  - "Custom Pressable (not Button.tsx) for CTA — mixed-weight text (semiBold + bold for FREE) requires nested Text"
  - "justifyContent: space-evenly on body — distributes whitespace across device sizes including iPhone SE"
  - "Feature bullets and headline left-aligned — cleaner reading flow than centered"
  - "Social proof boxes use flex: 1 not fixed 140px — fills row symmetrically on any screen width"
  - "fixedBottomCTA paddingBottom token updated from 24 to 8 — reduces visual weight at bottom globally"

patterns-established:
  - "handleDismiss: completeOnboarding() then router.replace('/(main)') — store first, then navigate"
  - "Close button: 36x36 circle with rgba(0,0,0,0.35) bg, top: insets.top + 12, right: 16"
  - "HERO_HEIGHT = Dimensions.get('window').height * 0.35 for responsive hero placeholder"

requirements-completed: [PAYW-04, PAYW-05, PAYW-06, PAYW-07, PAYW-08, PAYW-09, PAYW-10]

# Metrics
duration: ~35min
completed: 2026-03-10
---

# Phase 6 Plan 01: Paywall Redesign Summary

**Standalone conversion paywall with hero placeholder, Ionicons feature bullets, flex social proof boxes, pricing block, bold CTA, and router.replace dismiss — approved after human-verify with visual tweaks applied**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-03-10T13:08:57Z
- **Completed:** 2026-03-10T13:45:00Z
- **Tasks:** 2 of 2 (1 auto + 1 checkpoint:human-verify — APPROVED)
- **Files modified:** 3

## Accomplishments

- Complete rewrite of `app/(onboarding)/paywall.tsx` — removed all OnboardingLayout, Reanimated, pricing toggle, and variant logic
- Hero placeholder (35% screen height, blue-tinted) with safe-area-aware close (x) button
- 3 feature bullets with Ionicons `ribbon` icons, social proof flex boxes, unlock pill, pricing block with large monthly rate and annual line, green trust line, bold CTA, footer links
- Both dismiss paths (close button + CTA) verified working — call `completeOnboarding()` then `router.replace('/(main)')`, back gesture does not return to paywall
- Visual tweaks applied and committed after user approval: left-aligned headline/bullets, flex social boxes, neutral unlock pill, reduced bottom padding, updated fixedBottomCTA token

## Task Commits

1. **Task 1: Rewrite paywall screen with standalone layout** - `f90801a` (feat)
2. **Task 2: Visual tweaks from human-verify checkpoint** - `a131965` (fix)

**Plan metadata:** `9e1db5f` (docs: complete plan — awaiting human-verify checkpoint)

## Files Created/Modified

- `app/(onboarding)/paywall.tsx` - Complete rewrite: standalone full-screen paywall with all 10 content sections, visual tweaks applied post-checkpoint
- `src/theme/components.ts` - fixedBottomCTA paddingBottom updated from 24 to 8
- `app/(main)/index.tsx` - Floating bottom bar offset reduced to spacing['2']

## Decisions Made

- Standalone layout (no OnboardingLayout) per user decision — conversion screen requires complete viewport control
- `router.replace` (not `router.push`) — prevents back gesture returning to paywall after dismiss
- Custom `Pressable` (not `Button.tsx`) for CTA — mixed-weight text requires nested `Text` (semiBold base + bold for "FREE")
- `justifyContent: space-evenly` on body zone — distributes whitespace evenly for iPhone SE compatibility
- Feature bullets and headline left-aligned (post-checkpoint) — cleaner reading flow than centered
- Social proof boxes use `flex: 1` instead of fixed 140px — fills row symmetrically on any screen width
- fixedBottomCTA paddingBottom token updated from 24 to 8 globally — applied as design token so all consumers benefit

## Deviations from Plan

### Visual Tweaks Applied Post-Checkpoint

These were identified during the human-verify checkpoint and applied as post-approval tweaks:

**1. [Post-checkpoint] Social proof boxes use flex: 1 instead of fixed 140px width**
- **Found during:** Task 2 (human-verify checkpoint — user feedback)
- **Issue:** Fixed 140px left gap on wider devices; boxes should fill the row
- **Fix:** Changed `width: 140` to `flex: 1` on each socialBox style
- **Files modified:** app/(onboarding)/paywall.tsx
- **Committed in:** a131965

**2. [Post-checkpoint] Headline and feature bullets left-aligned**
- **Found during:** Task 2 (human-verify checkpoint — user feedback)
- **Issue:** Centered layout felt less grounded; left-align matches natural reading pattern
- **Fix:** Changed headline textAlign to 'left'; featuresContainer alignSelf left-aligned
- **Files modified:** app/(onboarding)/paywall.tsx
- **Committed in:** a131965

**3. [Post-checkpoint] Unlock pill uses neutral secondary colors**
- **Found during:** Task 2 (human-verify checkpoint — user feedback)
- **Issue:** Pill using actionPrimary blue was visually too heavy above the pricing block
- **Fix:** Changed pill bg to bgSurface, icon and text to textSecondary
- **Files modified:** app/(onboarding)/paywall.tsx
- **Committed in:** a131965

**4. [Post-checkpoint] fixedBottomCTA token paddingBottom 24 -> 8**
- **Found during:** Task 2 (human-verify checkpoint — user feedback)
- **Issue:** 24px bottom padding was visually too tall on the paywall footer
- **Fix:** Updated token in components.ts from 24 to 8; applied globally
- **Files modified:** src/theme/components.ts, app/(main)/index.tsx
- **Committed in:** a131965

---

**Total deviations:** 4 visual tweaks post-checkpoint (all from human-verify user feedback)
**Impact on plan:** All tweaks are visual polish to alignment and color weight. No structural changes. Spec was directionally correct; tweaks refined the implementation.

## Issues Encountered

None. `npx expo export --platform ios` passed cleanly. Visual tweaks were expected to emerge from human-verify checkpoint — this is normal for UI work.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Paywall screen is production-ready as a prototype conversion screen
- `completeOnboarding()` + `router.replace('/(main)')` dismiss pattern works correctly for both paths
- Back gesture confirmed non-functional to paywall after dismiss
- If real hero image assets become available, replace blue-tinted placeholder `View` with `Image` — dimensions and layout already set up
- Phase 7 (polish / remaining work) can build on the zone-based layout pattern established here

## Self-Check: PASSED

- `app/(onboarding)/paywall.tsx` — FOUND
- `src/theme/components.ts` — FOUND
- `app/(main)/index.tsx` — FOUND
- Commit `f90801a` — FOUND
- Commit `a131965` — FOUND
- `.planning/phases/06-paywall-redesign/06-01-SUMMARY.md` — FOUND

---
*Phase: 06-paywall-redesign*
*Completed: 2026-03-10*

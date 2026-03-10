# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-09
**Phases:** 3 | **Plans:** 10 | **Timeline:** 4 days

### What Was Built
- Centralized design system with theme tokens, hydration guard, React Compiler, ESLint rules
- 12-screen animated onboarding wizard with shared layout, uncontrolled inputs, spring animations
- Personalized paywall with adaptive toggle, Nature Day discount variant
- Full-bleed map with Supercluster clustering, shape-coded markers, Ionicons floating nav
- Profile and community push screens with social-feed card layout

### What Worked
- Brownfield approach: building on existing prototype saved significant time vs greenfield
- Phase structure (foundation → UX flow → map) created natural dependencies without blocking
- UAT gap closure pattern: running UAT after initial plans, then creating targeted gap-closure plans caught 8+ issues
- Raw Supercluster over library wrapper: avoided New Architecture compatibility issues entirely
- OnboardingLayout slot pattern: single component eliminated duplication across 12 screens

### What Was Inefficient
- ROADMAP.md plan checkboxes were not consistently updated during execution (some still unchecked)
- SUMMARY.md files missing `requirements_completed` frontmatter — limits automated cross-referencing
- Phase 1 progress table in ROADMAP showed 0/2 despite being complete (stale progress tracking)
- Dead code in theme (widgetSpacing export, unused buttons preset) was created during foundation and never cleaned

### Patterns Established
- `borderCurve: continuous` alongside every `borderRadius` (STYL-01)
- OnboardingLayout with illustration/header/children/footer slots and internal safe area handling
- Uncontrolled TextInput with ref-based value access for performance
- AVATAR_MAP record pattern for mapping selection state to visual config
- Adaptive width toggle using onLayout + useSharedValue (no hardcoded dimensions)

### Key Lessons
1. UAT-driven gap closure is highly effective — plan → execute → UAT → gap plans → execute catches real issues
2. Library compatibility with New Architecture should be researched before planning (Supercluster was a pivot)
3. Theme barrel files are legitimate exceptions to no-barrel-files — document exemptions upfront
4. Dead code should be cleaned in the same phase it's identified, not deferred

### Cost Observations
- Sessions: ~6-8 across 4 days
- Notable: Plans averaged 2-3 minutes each — very fast execution due to brownfield nature

---

## Milestone: v1.1 — Polish & Refinement

**Shipped:** 2026-03-10
**Phases:** 5 | **Plans:** 13 | **Timeline:** 2 days

### What Was Built
- Design system enforcement — Rubik font build-time loading, splash screen, token sweep across all screens
- Auto-scrolling bird mosaic welcome screen with bottom-sheet auth drawer
- Conversion-optimized standalone paywall with hero, pricing, social proof, and dismiss-to-home
- Native tab bar (4 tabs), full-width swipeable bird detail drawer, scrollable detail screen
- Auth drawer fix, onboarding top-alignment, keyboard avoidance, profile achievements vertical list

### What Worked
- Milestone audit before completion caught 3 real gaps (AUTH-01, ONBR-08/09) that would have shipped broken
- Gap closure phase (Phase 8) pattern: audit → targeted plans → quick execution closed all gaps in one pass
- NativeTabs fallback strategy: pre-planned fallback to standard Tabs activated cleanly when alpha library failed
- @gorhom/bottom-sheet reuse: same library served auth drawer (Phase 5) and map drawer (Phase 7)
- Standalone layout pattern for unique screens (welcome, paywall) avoided fighting OnboardingLayout constraints

### What Was Inefficient
- ROADMAP.md plan checkboxes still not auto-updated (carried over from v1.0)
- Phase 4 shows 3/4 in progress table but all 4 plans have SUMMARY.md files (stale tracking)
- Nyquist validation partial across 4/5 phases — skipped during fast execution
- Some SUMMARY files missing frontmatter fields (one_liner, requirements_completed) — limits automated extraction

### Patterns Established
- Weight-specific font families: `fontWeights.regular/medium/semiBold` instead of CSS fontWeight
- Standalone full-screen layout for conversion/unique screens (welcome, paywall)
- Dismiss-then-navigate: close drawer/sheet before router.push to avoid animation conflicts
- 44x44px hitArea wrapper for minimum tap targets on interactive elements
- BottomSheetModalProvider at root layout for portal rendering above tab bar
- Root-level screens for non-tab destinations (bird-detail, profile)

### Key Lessons
1. Milestone audit is essential before completion — found real implementation gaps despite all checkboxes being checked
2. Alpha libraries (NativeTabs) need fallback plans — having one saved significant time when it failed
3. Fast execution (2 days, 13 plans) is achievable when foundation and patterns are solid from previous milestone
4. Bottom-sheet is a versatile primitive — auth drawer and map drawer are very different UX but same underlying component
5. Post-checkpoint visual verification catches issues that static code analysis misses (NativeTabs, drawer z-order)

### Cost Observations
- Sessions: ~4-5 across 2 days
- Notable: Average plan duration dropped significantly from v1.0 — patterns and conventions were reusable

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Timeline | Phases | Plans | Key Change |
|-----------|----------|--------|-------|------------|
| v1.0 | 4 days | 3 | 10 | Baseline — UAT gap closure pattern established |
| v1.1 | 2 days | 5 | 13 | Milestone audit + gap closure phase; NativeTabs fallback |

### Cumulative Quality

| Milestone | Requirements | Coverage | Tech Debt Items |
|-----------|-------------|----------|-----------------|
| v1.0 | 16/16 | 100% | 4 (non-blocking) |
| v1.1 | 29/29 | 100% | 4 (non-blocking) |

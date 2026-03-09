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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Timeline | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 4 days | 3 | Baseline — UAT gap closure pattern established |

### Cumulative Quality

| Milestone | Requirements | Coverage | Tech Debt Items |
|-----------|-------------|----------|-----------------|
| v1.0 | 16/16 | 100% | 4 (non-blocking) |

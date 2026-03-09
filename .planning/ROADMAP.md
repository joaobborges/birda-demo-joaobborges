# Roadmap: Birda

## Overview

Birda is a brownfield prototype -- the core stack and basic screens exist. The work is polish and completion, not greenfield construction. Phase 1 lays the foundation that every subsequent screen depends on (theme tokens, hydration fix, tooling). Phase 2 polishes the entire onboarding-to-paywall flow as a single user journey. Phase 3 completes the map experience with clustering, floating UI, and the form sheet screens that open from the map. At any stopping point after Phase 1, the demo is presentable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Theme tokens, hydration guard, React Compiler, and ESLint rules
- [ ] **Phase 2: Onboarding and Paywall** - Polished onboarding wizard flow and paywall with variant support
- [ ] **Phase 3: Map and Screens** - Marker clustering, floating UI overlay, and form sheet screens

## Phase Details

### Phase 1: Foundation
**Goal**: Every screen draws from a single source of truth for styling, returning users never flash onboarding, and tooling catches bugs automatically
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04
**Success Criteria** (what must be TRUE):
  1. All color values and spacing throughout the app reference centralized theme tokens -- no hardcoded hex strings in screen files
  2. A returning user who has completed onboarding sees the map immediately on app launch with no flash of the welcome screen
  3. React Compiler is active and components are auto-memoized (verified via React DevTools or compiler output)
  4. Running the linter flags any use of `&&` with potentially falsy render values and any barrel file imports
**Plans:** 2 plans

Plans:
- [ ] 01-01-PLAN.md — Tooling and config: hydration guard, React Compiler, ESLint setup
- [ ] 01-02-PLAN.md — Theme token extension and full hex-to-token migration sweep

### Phase 2: Onboarding and Paywall
**Goal**: A first-time user experiences a smooth, animated onboarding wizard with consistent styling and lands on a personalized paywall with working plan toggle and discount variant
**Depends on**: Phase 1 (theme tokens, styling conventions)
**Requirements**: ONBR-01, ONBR-02, ONBR-03, PAYW-01, PAYW-02, PAYW-03, STYL-01
**Success Criteria** (what must be TRUE):
  1. Each onboarding screen animates in with content fade and spring button effects -- no jarring cuts between steps
  2. All onboarding screens share a single layout component with no duplicated style definitions
  3. Name and location inputs do not re-render the screen on every keystroke -- text commits only when user taps Continue
  4. Paywall headline includes the user's name or skill level from onboarding, plan toggle animates smoothly and adapts to any screen width
  5. Activating the Nature Day variant via debug panel shows 20% discount pricing with urgency copy
**Plans:** 5 plans

Plans:
- [x] 02-01-PLAN.md — Foundation: OnboardingLayout component, store updates, fade animation, old screen cleanup
- [x] 02-02-PLAN.md — Onboarding screens: welcome, 4 feature tour, 3 quiz screens
- [x] 02-03-PLAN.md — Paywall redesign, post-paywall screens, borderCurve sweep
- [ ] 02-04-PLAN.md — Gap closure: full-bleed layout restructure, pinned footer, ghost button, translucent status bar
- [ ] 02-05-PLAN.md — Gap closure: dynamic birding journey avatar, smooth paywall toggle animation

### Phase 3: Map and Screens
**Goal**: The map screen is the polished home experience -- clustered markers, floating navigation UI, and native form sheet screens for profile and community
**Depends on**: Phase 2 (onboarding completes before map is reached)
**Requirements**: MAP-01, MAP-02, MAP-03, SCRN-01, SCRN-02
**Success Criteria** (what must be TRUE):
  1. Bird markers visibly cluster at lower zoom levels and expand into individual markers as the user zooms in
  2. Map has floating UI overlay with profile icon (top-left), community and notification icons (top-right), and capture and logbook buttons (bottom)
  3. BirdMarker and BirdInfoCard are standalone components in src/components/map/ and are not defined inline in the map screen
  4. Tapping the profile icon opens a native form sheet with avatar, username, skill badge, and mock achievement badges
  5. Tapping the community icon opens a native form sheet with a scrollable feed of mock bird sightings
**Plans:** 2 plans

Plans:
- [ ] 03-01-PLAN.md — Map clustering, custom markers, Ionicons floating UI, component extraction, layout update
- [ ] 03-02-PLAN.md — Profile and Community screen polish with Ionicons and like counts

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Onboarding and Paywall | 3/5 | In Progress (gap closure) |  |
| 3. Map and Screens | 0/2 | Not started | - |
